import { binanceTradeService } from '../services/binanceTradeService';

async function executeStrategy(userId: string) {
  try {
    // 下单前检查余额
    const balance = await binanceTradeService.getAccountBalance(userId, 'BTCUSDT');
    console.log('Current balance:', balance);

    // 执行订单
    const order = await binanceTradeService.sendOrder(userId, {
      symbol: 'BTCUSDT',
      side: 'BUY',
      quantity: 0.001,
      isSpot: true
    });

    // 查询订单状态
    const status = await binanceTradeService.getOrderStatus(userId, order.orderId);
    console.log('Order status:', status);
  } catch (error) {
    console.error('Strategy execution failed:', error);
  }
} 