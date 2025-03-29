from typing import Dict, Optional
from decimal import Decimal
import logging
from datetime import datetime

logger = logging.getLogger(__name__)

class PositionManager:
    def __init__(self, user_id: str, exchange_client):
        self.user_id = user_id
        self.exchange_client = exchange_client
        self.positions: Dict[str, Dict] = {}
        self.balance: Optional[Decimal] = None
        self.available_balance: Optional[Decimal] = None
        self.used_margin: Optional[Decimal] = None

    async def update_balance(self) -> None:
        """更新用户余额信息"""
        try:
            account_info = await self.exchange_client.get_account_info()
            self.balance = Decimal(account_info['total_balance'])
            self.available_balance = Decimal(account_info['available_balance'])
            self.used_margin = Decimal(account_info['used_margin'])
            logger.info(f"Updated balance for user {self.user_id}: {self.balance}")
        except Exception as e:
            logger.error(f"Error updating balance for user {self.user_id}: {str(e)}")
            raise

    def calculate_position_size(
        self,
        symbol: str,
        leverage: int,
        risk_percentage: float,
        market_price: Decimal
    ) -> Dict:
        """
        计算开仓仓位大小
        
        Args:
            symbol: 交易对
            leverage: 杠杆倍数
            risk_percentage: 风险比例 (0-1)
            market_price: 当前市场价格
            
        Returns:
            Dict: 包含仓位信息的字典
        """
        if not self.available_balance:
            raise ValueError("Available balance not initialized")

        # 计算基础仓位大小
        base_position_size = self.available_balance * Decimal(str(risk_percentage))
        
        # 计算杠杆后的仓位大小
        leveraged_position_size = base_position_size * Decimal(str(leverage))
        
        # 计算所需保证金
        margin_required = leveraged_position_size / Decimal(str(leverage))
        
        # 计算最大杠杆
        max_leverage = self.available_balance / (self.available_balance * Decimal(str(risk_percentage)))
        
        # 计算风险价值
        risk_value = leveraged_position_size * Decimal('0.01')  # 假设1%的价格波动
        
        return {
            'symbol': symbol,
            'base_position_size': base_position_size,
            'leveraged_position_size': leveraged_position_size,
            'margin_required': margin_required,
            'max_leverage': max_leverage,
            'risk_value': risk_value,
            'leverage': leverage,
            'market_price': market_price,
            'timestamp': datetime.utcnow().isoformat()
        }

    def validate_position(self, position_info: Dict) -> bool:
        """
        验证仓位是否有效
        
        Args:
            position_info: 仓位信息
            
        Returns:
            bool: 仓位是否有效
        """
        if not self.available_balance:
            return False
            
        # 检查保证金是否足够
        if position_info['margin_required'] > self.available_balance:
            return False
            
        # 检查杠杆是否超过最大允许值
        if position_info['leverage'] > position_info['max_leverage']:
            return False
            
        # 检查风险价值是否在可接受范围内
        max_risk_value = self.available_balance * Decimal('0.02')  # 最大风险为可用余额的2%
        if position_info['risk_value'] > max_risk_value:
            return False
            
        return True

    async def open_position(
        self,
        symbol: str,
        side: str,
        leverage: int,
        risk_percentage: float,
        market_price: Decimal
    ) -> Dict:
        """
        开仓
        
        Args:
            symbol: 交易对
            side: 交易方向 ('buy' or 'sell')
            leverage: 杠杆倍数
            risk_percentage: 风险比例
            market_price: 当前市场价格
            
        Returns:
            Dict: 开仓结果
        """
        try:
            # 更新余额
            await self.update_balance()
            
            # 计算仓位
            position_info = self.calculate_position_size(
                symbol,
                leverage,
                risk_percentage,
                market_price
            )
            
            # 验证仓位
            if not self.validate_position(position_info):
                raise ValueError("Invalid position parameters")
            
            # 设置杠杆
            await self.exchange_client.set_leverage(symbol, leverage)
            
            # 执行开仓
            order = await self.exchange_client.create_order(
                symbol=symbol,
                side=side,
                type='market',
                quantity=position_info['leveraged_position_size'],
                price=market_price
            )
            
            # 更新仓位信息
            position_info['order_id'] = order['order_id']
            position_info['side'] = side
            self.positions[symbol] = position_info
            
            logger.info(f"Opened position for user {self.user_id}: {position_info}")
            return position_info
            
        except Exception as e:
            logger.error(f"Error opening position for user {self.user_id}: {str(e)}")
            raise

    async def close_position(self, symbol: str) -> Dict:
        """
        平仓
        
        Args:
            symbol: 交易对
            
        Returns:
            Dict: 平仓结果
        """
        try:
            if symbol not in self.positions:
                raise ValueError(f"No open position for {symbol}")
                
            position = self.positions[symbol]
            
            # 执行平仓
            order = await self.exchange_client.create_order(
                symbol=symbol,
                side='sell' if position['side'] == 'buy' else 'buy',
                type='market',
                quantity=position['leveraged_position_size'],
                price=position['market_price']
            )
            
            # 更新仓位信息
            position['close_order_id'] = order['order_id']
            position['closed_at'] = datetime.utcnow().isoformat()
            
            # 计算盈亏
            pnl = (order['price'] - position['market_price']) * position['leveraged_position_size']
            if position['side'] == 'sell':
                pnl = -pnl
                
            position['pnl'] = pnl
            
            # 从活跃仓位中移除
            del self.positions[symbol]
            
            logger.info(f"Closed position for user {self.user_id}: {position}")
            return position
            
        except Exception as e:
            logger.error(f"Error closing position for user {self.user_id}: {str(e)}")
            raise

    def get_position_summary(self) -> Dict:
        """
        获取仓位摘要
        
        Returns:
            Dict: 仓位摘要信息
        """
        return {
            'total_positions': len(self.positions),
            'total_used_margin': self.used_margin,
            'available_balance': self.available_balance,
            'positions': self.positions
        }

    def get_position_risk_metrics(self) -> Dict:
        """
        获取仓位风险指标
        
        Returns:
            Dict: 风险指标信息
        """
        total_risk_value = sum(
            position['risk_value'] for position in self.positions.values()
        )
        
        return {
            'total_risk_value': total_risk_value,
            'risk_ratio': total_risk_value / self.available_balance if self.available_balance else 0,
            'max_risk_allowed': self.available_balance * Decimal('0.02') if self.available_balance else 0
        } 