from typing import Dict, Optional
from decimal import Decimal
import logging
from datetime import datetime
from ..models.user import User
from ..exchange_client import ExchangeClient
from ..config import settings

logger = logging.getLogger(__name__)

class FundManager:
    def __init__(self, user: User, exchange_client: Optional[ExchangeClient] = None):
        self.user = user
        self.exchange_client = exchange_client
        self.balance: Optional[Decimal] = None
        self.available_balance: Optional[Decimal] = None
        self.used_margin: Optional[Decimal] = None
        self.custody_type = user.custody_type  # 'platform' or 'exchange'
        self.exchange_api_key = user.exchange_api_key
        self.exchange_api_secret = user.exchange_api_secret
        self.exchange_name = user.exchange_name

    async def initialize(self):
        """初始化资金管理器"""
        if self.custody_type == 'exchange' and self.exchange_client is None:
            self.exchange_client = ExchangeClient(
                self.exchange_api_key,
                self.exchange_api_secret
            )
        await self.update_balance()

    async def update_balance(self) -> None:
        """更新余额信息"""
        try:
            if self.custody_type == 'platform':
                # 从平台数据库获取余额
                from ..database import get_database
                db = get_database()
                user_balance = await db.users.find_one(
                    {'_id': self.user.id},
                    {'balance': 1, 'available_balance': 1, 'used_margin': 1}
                )
                if user_balance:
                    self.balance = Decimal(str(user_balance.get('balance', 0)))
                    self.available_balance = Decimal(str(user_balance.get('available_balance', 0)))
                    self.used_margin = Decimal(str(user_balance.get('used_margin', 0)))
            else:
                # 从交易所获取余额
                account_info = await self.exchange_client.get_account_info()
                self.balance = Decimal(account_info['total_balance'])
                self.available_balance = Decimal(account_info['available_balance'])
                self.used_margin = Decimal(account_info['used_margin'])

            logger.info(f"Updated balance for user {self.user.id}: {self.balance}")
        except Exception as e:
            logger.error(f"Error updating balance for user {self.user.id}: {str(e)}")
            raise

    async def deposit(self, amount: Decimal) -> Dict:
        """
        充值
        
        Args:
            amount: 充值金额
            
        Returns:
            Dict: 充值结果
        """
        try:
            if self.custody_type != 'platform':
                raise ValueError("Deposit only available for platform custody")

            # 更新平台数据库中的余额
            from ..database import get_database
            db = get_database()
            result = await db.users.update_one(
                {'_id': self.user.id},
                {
                    '$inc': {
                        'balance': amount,
                        'available_balance': amount
                    }
                }
            )
            
            if result.modified_count == 0:
                raise ValueError("Failed to update balance")

            # 记录充值历史
            await db.deposit_history.insert_one({
                'user_id': self.user.id,
                'amount': amount,
                'timestamp': datetime.utcnow(),
                'status': 'completed'
            })

            await self.update_balance()
            return {
                'status': 'success',
                'amount': amount,
                'new_balance': self.balance
            }
        except Exception as e:
            logger.error(f"Error processing deposit for user {self.user.id}: {str(e)}")
            raise

    async def withdraw(self, amount: Decimal) -> Dict:
        """
        提现
        
        Args:
            amount: 提现金额
            
        Returns:
            Dict: 提现结果
        """
        try:
            if self.custody_type != 'platform':
                raise ValueError("Withdraw only available for platform custody")

            if amount > self.available_balance:
                raise ValueError("Insufficient balance")

            # 更新平台数据库中的余额
            from ..database import get_database
            db = get_database()
            result = await db.users.update_one(
                {'_id': self.user.id},
                {
                    '$inc': {
                        'balance': -amount,
                        'available_balance': -amount
                    }
                }
            )
            
            if result.modified_count == 0:
                raise ValueError("Failed to update balance")

            # 记录提现历史
            await db.withdraw_history.insert_one({
                'user_id': self.user.id,
                'amount': amount,
                'timestamp': datetime.utcnow(),
                'status': 'completed'
            })

            await self.update_balance()
            return {
                'status': 'success',
                'amount': amount,
                'new_balance': self.balance
            }
        except Exception as e:
            logger.error(f"Error processing withdrawal for user {self.user.id}: {str(e)}")
            raise

    async def update_exchange_api(
        self,
        exchange_name: str,
        api_key: str,
        api_secret: str
    ) -> Dict:
        """
        更新交易所API信息
        
        Args:
            exchange_name: 交易所名称
            api_key: API密钥
            api_secret: API密钥
            
        Returns:
            Dict: 更新结果
        """
        try:
            if self.custody_type != 'exchange':
                raise ValueError("API update only available for exchange custody")

            # 验证API密钥
            test_client = ExchangeClient(api_key, api_secret)
            await test_client.get_account_info()

            # 更新用户信息
            from ..database import get_database
            db = get_database()
            result = await db.users.update_one(
                {'_id': self.user.id},
                {
                    '$set': {
                        'exchange_name': exchange_name,
                        'exchange_api_key': api_key,
                        'exchange_api_secret': api_secret
                    }
                }
            )

            if result.modified_count == 0:
                raise ValueError("Failed to update exchange API")

            # 更新本地客户端
            self.exchange_client = test_client
            self.exchange_name = exchange_name
            self.exchange_api_key = api_key
            self.exchange_api_secret = api_secret

            return {
                'status': 'success',
                'exchange_name': exchange_name
            }
        except Exception as e:
            logger.error(f"Error updating exchange API for user {self.user.id}: {str(e)}")
            raise

    def get_balance_info(self) -> Dict:
        """
        获取余额信息
        
        Returns:
            Dict: 余额信息
        """
        return {
            'custody_type': self.custody_type,
            'exchange_name': self.exchange_name if self.custody_type == 'exchange' else None,
            'balance': self.balance,
            'available_balance': self.available_balance,
            'used_margin': self.used_margin
        }

    async def execute_trade(
        self,
        symbol: str,
        side: str,
        quantity: Decimal,
        price: Optional[Decimal] = None
    ) -> Dict:
        """
        执行交易
        
        Args:
            symbol: 交易对
            side: 交易方向
            quantity: 交易数量
            price: 交易价格（可选）
            
        Returns:
            Dict: 交易结果
        """
        try:
            if self.custody_type == 'platform':
                # 检查余额是否足够
                required_margin = quantity * (price or await self.exchange_client.get_symbol_price(symbol))
                if required_margin > self.available_balance:
                    raise ValueError("Insufficient balance")

                # 执行交易
                order = await self.exchange_client.create_order(
                    symbol=symbol,
                    side=side,
                    type='market' if price is None else 'limit',
                    quantity=quantity,
                    price=price
                )

                # 更新平台数据库中的余额
                from ..database import get_database
                db = get_database()
                await db.users.update_one(
                    {'_id': self.user.id},
                    {
                        '$inc': {
                            'available_balance': -required_margin,
                            'used_margin': required_margin
                        }
                    }
                )
            else:
                # 通过用户提供的API执行交易
                order = await self.exchange_client.create_order(
                    symbol=symbol,
                    side=side,
                    type='market' if price is None else 'limit',
                    quantity=quantity,
                    price=price
                )

            await self.update_balance()
            return order
        except Exception as e:
            logger.error(f"Error executing trade for user {self.user.id}: {str(e)}")
            raise 