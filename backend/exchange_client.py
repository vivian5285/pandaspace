from typing import Dict, List, Optional
from decimal import Decimal
import ccxt
import logging
from fastapi import Depends
from .config import settings

logger = logging.getLogger(__name__)

class ExchangeClient:
    def __init__(self, api_key: str, api_secret: str):
        self.exchange = ccxt.binance({
            'apiKey': api_key,
            'secret': api_secret,
            'enableRateLimit': True,
            'options': {
                'defaultType': 'future',
                'adjustForTimeDifference': True,
            }
        })

    async def get_account_info(self) -> Dict:
        """获取账户信息"""
        try:
            balance = await self.exchange.fetch_balance()
            return {
                'total_balance': balance['total']['USDT'],
                'available_balance': balance['free']['USDT'],
                'used_margin': balance['used']['USDT']
            }
        except Exception as e:
            logger.error(f"Error fetching account info: {str(e)}")
            raise

    async def get_symbol_price(self, symbol: str) -> Decimal:
        """获取交易对当前价格"""
        try:
            ticker = await self.exchange.fetch_ticker(symbol)
            return Decimal(str(ticker['last']))
        except Exception as e:
            logger.error(f"Error fetching price for {symbol}: {str(e)}")
            raise

    async def get_leverage_options(self, symbol: str) -> List[int]:
        """获取交易对支持的杠杆选项"""
        try:
            markets = await self.exchange.fetch_markets()
            for market in markets:
                if market['symbol'] == symbol:
                    return market['leverage_brackets']
            return [1, 3, 5, 10, 20, 50, 100]  # 默认杠杆选项
        except Exception as e:
            logger.error(f"Error fetching leverage options for {symbol}: {str(e)}")
            return [1, 3, 5, 10, 20, 50, 100]  # 默认杠杆选项

    async def set_leverage(self, symbol: str, leverage: int) -> None:
        """设置杠杆倍数"""
        try:
            await self.exchange.fapiPrivate_post_leverage({
                'symbol': symbol,
                'leverage': leverage
            })
        except Exception as e:
            logger.error(f"Error setting leverage for {symbol}: {str(e)}")
            raise

    async def create_order(
        self,
        symbol: str,
        side: str,
        type: str,
        quantity: Decimal,
        price: Optional[Decimal] = None
    ) -> Dict:
        """创建订单"""
        try:
            params = {
                'symbol': symbol,
                'side': side,
                'type': type,
                'amount': float(quantity),
            }
            if price:
                params['price'] = float(price)

            order = await self.exchange.create_order(**params)
            return {
                'order_id': order['id'],
                'symbol': order['symbol'],
                'side': order['side'],
                'type': order['type'],
                'amount': order['amount'],
                'price': order['price'],
                'status': order['status']
            }
        except Exception as e:
            logger.error(f"Error creating order for {symbol}: {str(e)}")
            raise

    async def get_open_positions(self) -> List[Dict]:
        """获取当前持仓"""
        try:
            positions = await self.exchange.fetch_positions()
            return [
                {
                    'symbol': position['symbol'],
                    'side': 'buy' if position['contracts'] > 0 else 'sell',
                    'contracts': abs(position['contracts']),
                    'entry_price': position['entryPrice'],
                    'leverage': position['leverage'],
                    'unrealized_pnl': position['unrealizedPnl']
                }
                for position in positions
                if position['contracts'] != 0
            ]
        except Exception as e:
            logger.error(f"Error fetching open positions: {str(e)}")
            raise

    async def get_order_status(self, symbol: str, order_id: str) -> Dict:
        """获取订单状态"""
        try:
            order = await self.exchange.fetch_order(order_id, symbol)
            return {
                'order_id': order['id'],
                'symbol': order['symbol'],
                'side': order['side'],
                'type': order['type'],
                'amount': order['amount'],
                'price': order['price'],
                'status': order['status'],
                'filled': order['filled'],
                'remaining': order['remaining']
            }
        except Exception as e:
            logger.error(f"Error fetching order status for {order_id}: {str(e)}")
            raise

    async def cancel_order(self, symbol: str, order_id: str) -> Dict:
        """取消订单"""
        try:
            result = await self.exchange.cancel_order(order_id, symbol)
            return {
                'order_id': result['id'],
                'status': result['status']
            }
        except Exception as e:
            logger.error(f"Error canceling order {order_id}: {str(e)}")
            raise

def get_exchange_client() -> ExchangeClient:
    """获取交易所客户端实例"""
    return ExchangeClient(
        api_key=settings.BINANCE_API_KEY,
        api_secret=settings.BINANCE_API_SECRET
    ) 