import Binance from 'binance-api-node';
import { retry } from '../utils/retry'; // 重试工具
import { logger } from '../utils/logger'; // 日志工具
import { db } from '../database/connection'; // 数据库连接
import { addRequestContext } from '../utils/logger'; // 添加请求追踪

interface BinanceCredentials {
  apiKey: string;
  apiSecret: string;
}

interface OrderParams {
  symbol: string;
  side: 'BUY' | 'SELL';
  quantity: number;
  isSpot?: boolean;
  type?: string;
  price?: number;
}

interface RiskLimits {
  maxOrderAmount: number;
  minOrderAmount: number;
  maxDailyOrders: number;
  maxLeverage: number;
  allowedSymbols: string[];
  maxSlippage: number;
  cooldownPeriod: number; // 订单间隔时间（毫秒）
}

class BinanceTradeService {
  private clients: Map<string, any> = new Map();
  private readonly isTestMode: boolean;
  private readonly riskLimits: RiskLimits;
  private lastOrderTime: Map<string, number> = new Map();

  constructor() {
    // 从环境变量读取是否为测试模式
    this.isTestMode = process.env.TRADE_MODE === 'test';
    
    // 从配置文件或环境变量加载风控参数
    this.riskLimits = {
      maxOrderAmount: parseFloat(process.env.MAX_ORDER_AMOUNT || '1000'),
      minOrderAmount: parseFloat(process.env.MIN_ORDER_AMOUNT || '10'),
      maxDailyOrders: parseInt(process.env.MAX_DAILY_ORDERS || '50'),
      maxLeverage: parseInt(process.env.MAX_LEVERAGE || '20'),
      allowedSymbols: (process.env.ALLOWED_SYMBOLS || 'BTCUSDT,ETHUSDT').split(','),
      maxSlippage: parseFloat(process.env.MAX_SLIPPAGE || '0.005'), // 0.5%
      cooldownPeriod: parseInt(process.env.ORDER_COOLDOWN || '1000'), // 1秒
    };
  }

  /**
   * 从数据库获取用户的 Binance API 密钥
   */
  private async getBinanceApiKeys(userId: string): Promise<BinanceCredentials> {
    try {
      const result = await db.query(
        'SELECT api_key, api_secret FROM user_api_keys WHERE user_id = ? AND platform = ?',
        [userId, 'binance']
      );

      if (!result || !result[0]) {
        throw new Error('API keys not found');
      }

      return {
        apiKey: result[0].api_key,
        apiSecret: result[0].api_secret
      };
    } catch (error) {
      logger.error(`Failed to get API keys for user ${userId}:`, error);
      throw new Error('Failed to retrieve API keys');
    }
  }

  /**
   * 增强的订单验证
   */
  private async validateOrder(userId: string, params: OrderParams): Promise<boolean> {
    // 基本参数检查
    if (!params.symbol || !params.quantity || !params.side) {
      throw new Error('Missing required order parameters');
    }

    // 检查交易对是否允许
    if (!this.riskLimits.allowedSymbols.includes(params.symbol)) {
      throw new Error(`Trading pair ${params.symbol} is not allowed`);
    }

    // 检查订单冷却期
    const lastOrderTime = this.lastOrderTime.get(userId) || 0;
    const now = Date.now();
    if (now - lastOrderTime < this.riskLimits.cooldownPeriod) {
      throw new Error('Order frequency exceeded');
    }

    // 获取当前市场价格
    const marketPrice = await this.getCurrentPrice(params.symbol);
    const orderAmount = marketPrice * params.quantity;

    // 金额限制检查
    if (orderAmount < this.riskLimits.minOrderAmount) {
      throw new Error(`Order amount ${orderAmount} is below minimum ${this.riskLimits.minOrderAmount}`);
    }
    if (orderAmount > this.riskLimits.maxOrderAmount) {
      throw new Error(`Order amount ${orderAmount} exceeds maximum ${this.riskLimits.maxOrderAmount}`);
    }

    // 滑点检查
    if (params.type === 'LIMIT') {
      const priceDeviation = Math.abs(params.price! - marketPrice) / marketPrice;
      if (priceDeviation > this.riskLimits.maxSlippage) {
        throw new Error(`Price deviation ${priceDeviation} exceeds maximum slippage ${this.riskLimits.maxSlippage}`);
      }
    }

    // 检查账户状态
    const accountInfo = await this.getAccountInfo(userId);
    if (!accountInfo.tradingEnabled) {
      throw new Error('Trading is disabled for this account');
    }

    // 更新最后下单时间
    this.lastOrderTime.set(userId, now);

    return true;
  }

  /**
   * 获取当前价格
   */
  async getCurrentPrice(symbol: string): Promise<number> {
    const client = await this.getBinanceClient('system');
    const ticker = await client.prices({ symbol });
    return parseFloat(ticker[symbol]);
  }

  /**
   * 获取账户余额
   */
  async getAccountBalance(userId: string, symbol: string) {
    const client = await this.getBinanceClient(userId);
    const account = await client.accountInfo();
    const usdt = parseFloat(account.balances.find(b => b.asset === 'USDT')?.free || '0');
    const asset = parseFloat(account.balances.find(b => b.asset === symbol.replace('USDT', ''))?.free || '0');
    return { usdt, asset };
  }

  /**
   * 获取用户当日订单数量
   */
  private async getDailyOrderCount(userId: string): Promise<number> {
    const result = await db.query(
      'SELECT COUNT(*) as count FROM orders WHERE user_id = ? AND created_at > CURDATE()',
      [userId]
    );
    return result[0].count;
  }

  /**
   * 错误处理增强
   */
  private handleError(error: any, context: string): never {
    // 对不同类型的错误进行分类处理
    if (error.code === -1021) {
      logger.error('Timestamp for this request was outside the recvWindow', {
        context,
        error,
      });
      throw new Error('Server time synchronization error');
    }

    if (error.code === -2010) {
      logger.error('Insufficient funds', {
        context,
        error,
      });
      throw new Error('Insufficient balance');
    }

    if (error.code === -2011) {
      logger.error('Unknown order sent', {
        context,
        error,
      });
      throw new Error('Invalid order');
    }

    // 记录未知错误
    logger.error('Unexpected error', {
      context,
      error,
      stack: error.stack,
    });

    throw new Error(`Trading error: ${error.message}`);
  }

  /**
   * 发送订单的增强版本
   */
  async sendOrder(userId: string, orderParams: OrderParams) {
    const requestId = Date.now().toString();
    const log = addRequestContext(requestId);

    try {
      await this.validateOrder(userId, orderParams);

      return await retry(
        async () => {
          const result = await this._executeOrder(userId, orderParams);
          log.info('Order executed successfully', {
            userId,
            symbol: orderParams.symbol,
            orderId: result.orderId,
          });
          return result;
        },
        {
          retries: 3,
          delay: 1000,
          shouldRetry: (error) => {
            // 只对特定错误进行重试
            const retryableCodes = [-1000, -1001, -1002];
            return retryableCodes.includes(error.code);
          },
          onRetry: (error, attempt) => {
            log.warn(`Retry attempt ${attempt}`, {
              userId,
              error: error.message,
            });
          },
        }
      );
    } catch (error) {
      this.handleError(error, 'sendOrder');
    }
  }

  /**
   * 执行实际下单
   */
  private async _executeOrder(userId: string, params: OrderParams) {
    const { symbol, side, quantity, isSpot = true } = params;
    const orderParams = {
      symbol,
      side,
      type: 'MARKET',
      quantity
    };

    return isSpot ? 
      await this.getBinanceClient(userId).order(orderParams) :
      await this.getBinanceClient(userId).futuresOrder({
        ...orderParams,
        positionSide: 'BOTH'
      });
  }

  /**
   * 模拟下单（测试模式）
   */
  private simulateOrder(params: OrderParams) {
    const price = Math.random() * 100; // 模拟价格
    return {
      symbol: params.symbol,
      side: params.side,
      quantity: params.quantity,
      price,
      status: 'FILLED',
      isSimulated: true
    };
  }

  /**
   * 保存订单记录到数据库
   */
  private async saveOrderToDb(userId: string, order: any) {
    await db.query(
      'INSERT INTO orders (user_id, symbol, side, quantity, price, status) VALUES (?, ?, ?, ?, ?, ?)',
      [userId, order.symbol, order.side, order.quantity, order.price, order.status]
    );
  }

  /**
   * 查询订单状态
   */
  async getOrderStatus(userId: string, orderId: string) {
    const client = await this.getBinanceClient(userId);
    return await client.getOrder({
      orderId,
      symbol: 'BTCUSDT' // 需要传入实际的交易对
    });
  }

  /**
   * 获取用户的 Binance 客户端实例
   */
  private async getBinanceClient(userId: string) {
    if (this.clients.has(userId)) {
      return this.clients.get(userId);
    }

    const credentials = await this.getBinanceApiKeys(userId);
    if (!credentials) {
      throw new Error('Binance API credentials not found');
    }

    const client = Binance({
      apiKey: credentials.apiKey,
      apiSecret: credentials.apiSecret,
    });

    this.clients.set(userId, client);
    return client;
  }

  /**
   * 清理用户的客户端实例
   */
  clearUserClient(userId: string) {
    this.clients.delete(userId);
  }
}

// 导出单例实例
export const binanceTradeService = new BinanceTradeService(); 