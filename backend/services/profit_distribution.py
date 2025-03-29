from typing import Dict, Optional
from decimal import Decimal
import logging
from datetime import datetime
from ..models.user import User
from ..database import get_database

logger = logging.getLogger(__name__)

class ProfitDistribution:
    def __init__(
        self,
        user: User,
        profit: Decimal,
        platform_fee: Decimal = Decimal('0.10'),
        leader_commission_1st: Decimal = Decimal('0.20'),
        leader_commission_2nd: Decimal = Decimal('0.10')
    ):
        self.user = user
        self.profit = profit
        self.platform_fee = platform_fee
        self.leader_commission_1st = leader_commission_1st
        self.leader_commission_2nd = leader_commission_2nd
        self.db = get_database()

    async def calculate_distribution(self) -> Dict:
        """
        计算收益分配
        
        Returns:
            Dict: 分配结果
        """
        try:
            # 计算平台抽成
            platform_fee_amount = self.profit * self.platform_fee
            
            # 获取用户的推荐关系
            user_info = await self.db.users.find_one(
                {'_id': self.user.id},
                {'referrer_id': 1, 'referrer_chain': 1}
            )
            
            if not user_info:
                raise ValueError("User not found")
            
            # 计算领导人抽成
            leader_commissions = {}
            if user_info.get('referrer_chain'):
                chain = user_info['referrer_chain']
                if len(chain) >= 2:
                    # 第一代领导人
                    leader_commissions[chain[0]] = self.profit * self.leader_commission_1st
                    # 第二代领导人
                    leader_commissions[chain[1]] = self.profit * self.leader_commission_2nd
            
            # 计算用户最终收益
            total_commission = platform_fee_amount + sum(leader_commissions.values())
            user_final_profit = self.profit - total_commission
            
            # 确保用户至少获得50%的收益
            if user_final_profit < self.profit * Decimal('0.5'):
                # 调整平台和领导人抽成比例
                platform_fee_amount = self.profit * Decimal('0.3')
                leader_commissions = {
                    leader_id: commission * Decimal('0.5')
                    for leader_id, commission in leader_commissions.items()
                }
                user_final_profit = self.profit - platform_fee_amount - sum(leader_commissions.values())
            
            return {
                'user_id': self.user.id,
                'total_profit': self.profit,
                'platform_fee': platform_fee_amount,
                'leader_commissions': leader_commissions,
                'user_final_profit': user_final_profit,
                'timestamp': datetime.utcnow()
            }
        except Exception as e:
            logger.error(f"Error calculating profit distribution for user {self.user.id}: {str(e)}")
            raise

    async def distribute_profits(self, distribution: Dict) -> Dict:
        """
        分配收益
        
        Args:
            distribution: 分配计算结果
            
        Returns:
            Dict: 分配结果
        """
        try:
            # 更新用户余额
            if distribution['user_final_profit'] > 0:
                await self.db.users.update_one(
                    {'_id': self.user.id},
                    {
                        '$inc': {
                            'balance': distribution['user_final_profit'],
                            'available_balance': distribution['user_final_profit']
                        }
                    }
                )
            
            # 更新平台收益
            if distribution['platform_fee'] > 0:
                await self.db.platform_earnings.insert_one({
                    'amount': distribution['platform_fee'],
                    'timestamp': datetime.utcnow(),
                    'source_user_id': self.user.id
                })
            
            # 更新领导人收益
            for leader_id, commission in distribution['leader_commissions'].items():
                if commission > 0:
                    await self.db.users.update_one(
                        {'_id': leader_id},
                        {
                            '$inc': {
                                'balance': commission,
                                'available_balance': commission
                            }
                        }
                    )
            
            # 记录分配历史
            await self.db.profit_distribution_history.insert_one({
                'user_id': self.user.id,
                'distribution': distribution,
                'timestamp': datetime.utcnow()
            })
            
            return {
                'status': 'success',
                'distribution': distribution
            }
        except Exception as e:
            logger.error(f"Error distributing profits for user {self.user.id}: {str(e)}")
            raise

    async def get_profit_history(
        self,
        start_time: Optional[datetime] = None,
        end_time: Optional[datetime] = None
    ) -> list:
        """
        获取收益分配历史
        
        Args:
            start_time: 开始时间
            end_time: 结束时间
            
        Returns:
            list: 历史记录列表
        """
        try:
            query = {'user_id': self.user.id}
            if start_time:
                query['timestamp'] = {'$gte': start_time}
            if end_time:
                if 'timestamp' in query:
                    query['timestamp']['$lte'] = end_time
                else:
                    query['timestamp'] = {'$lte': end_time}
            
            cursor = self.db.profit_distribution_history.find(query)
            return await cursor.to_list(length=None)
        except Exception as e:
            logger.error(f"Error fetching profit history for user {self.user.id}: {str(e)}")
            raise 