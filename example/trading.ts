import { binanceTradeService } from '../services/binanceTradeService';
import { logger } from '../utils/logger';

async function executeTrade(userId: string) {
  try {
    const order = await binanceTradeService.sendOrder(userId, {
      symbol: 'BTCUSDT',
      side: 'BUY',
      quantity: 0.001,
      type: 'MARKET',
    });

    logger.info('Trade executed successfully', {
      userId,
      orderId: order.orderId,
      symbol: order.symbol,
    });

    return order;
  } catch (error) {
    logger.error('Trade execution failed', {
      userId,
      error: error.message,
      stack: error.stack,
    });
    throw error;
  }
} 