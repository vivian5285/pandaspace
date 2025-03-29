import crypto from 'crypto';
import axios from 'axios';

interface OrderParams {
  symbol: string;
  side: 'BUY' | 'SELL';
  type: 'MARKET' | 'LIMIT';
  quantity: number;
  leverage?: number;
  stopLoss?: number;
  takeProfit?: number;
}

export class BinanceService {
  private apiKey: string;
  private apiSecret: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = process.env.BINANCE_API_KEY || '';
    this.apiSecret = process.env.BINANCE_API_SECRET || '';
    this.baseUrl = 'https://fapi.binance.com/fapi/v1'; // 合约API
  }

  // 创建订单
  async createOrder(params: OrderParams): Promise<any> {
    const timestamp = Date.now();
    const queryString = this.buildQueryString(params);
    const signature = this.generateSignature(queryString, timestamp);

    try {
      const response = await axios.post(
        `${this.baseUrl}/order`,
        params,
        {
          headers: {
            'X-MBX-APIKEY': this.apiKey,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          params: {
            timestamp,
            signature,
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error('Binance API Error:', error);
      throw new Error('Failed to create order');
    }
  }

  // 获取账户余额
  async getAccountBalance(): Promise<any> {
    const timestamp = Date.now();
    const signature = this.generateSignature('', timestamp);

    try {
      const response = await axios.get(`${this.baseUrl}/account`, {
        headers: {
          'X-MBX-APIKEY': this.apiKey,
        },
        params: {
          timestamp,
          signature,
        },
      });

      return response.data;
    } catch (error) {
      console.error('Binance API Error:', error);
      throw new Error('Failed to get account balance');
    }
  }

  // 获取市场数据
  async getMarketData(symbol: string): Promise<any> {
    try {
      const response = await axios.get(`${this.baseUrl}/ticker/price`, {
        params: { symbol },
      });

      return response.data;
    } catch (error) {
      console.error('Binance API Error:', error);
      throw new Error('Failed to get market data');
    }
  }

  // 设置杠杆
  async setLeverage(symbol: string, leverage: number): Promise<void> {
    const timestamp = Date.now();
    const queryString = `symbol=${symbol}&leverage=${leverage}`;
    const signature = this.generateSignature(queryString, timestamp);

    try {
      await axios.post(
        `${this.baseUrl}/leverage`,
        { symbol, leverage },
        {
          headers: {
            'X-MBX-APIKEY': this.apiKey,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          params: {
            timestamp,
            signature,
          },
        }
      );
    } catch (error) {
      console.error('Binance API Error:', error);
      throw new Error('Failed to set leverage');
    }
  }

  // 设置止损止盈
  async setStopLossAndTakeProfit(
    symbol: string,
    stopLoss: number,
    takeProfit: number
  ): Promise<void> {
    const timestamp = Date.now();
    const queryString = `symbol=${symbol}&stopLoss=${stopLoss}&takeProfit=${takeProfit}`;
    const signature = this.generateSignature(queryString, timestamp);

    try {
      await axios.post(
        `${this.baseUrl}/order/oco`,
        { symbol, stopLoss, takeProfit },
        {
          headers: {
            'X-MBX-APIKEY': this.apiKey,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          params: {
            timestamp,
            signature,
          },
        }
      );
    } catch (error) {
      console.error('Binance API Error:', error);
      throw new Error('Failed to set stop loss and take profit');
    }
  }

  // 私有辅助方法
  private buildQueryString(params: any): string {
    return Object.entries(params)
      .map(([key, value]) => `${key}=${value}`)
      .join('&');
  }

  private generateSignature(queryString: string, timestamp: number): string {
    const data = `${queryString}&timestamp=${timestamp}`;
    return crypto
      .createHmac('sha256', this.apiSecret)
      .update(data)
      .digest('hex');
  }
} 