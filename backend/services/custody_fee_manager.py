from typing import Dict, Optional
from decimal import Decimal
import logging
from datetime import datetime, timedelta
from ..models.user import User
from ..database import get_database

logger = logging.getLogger(__name__)

class CustodyFeeManager:
    def __init__(
        self,
        user: User,
        platform_fee: Decimal = Decimal('0.10'),
        leader_commission_1st: Decimal = Decimal('0.20'),
        leader_commission_2nd: Decimal = Decimal('0.10')
    ):
        self.user = user
        self.platform_fee = platform_fee
        self.leader_commission_1st = leader_commission_1st
        self.leader_commission_2nd = leader_commission_2nd
        self.db = get_database()

    async def calculate_custody_fee(self, profit: Decimal) -> Dict:
        """
        计算托管费用
        
        Args:
            profit: 交易盈利
            
        Returns:
            Dict: 费用计算结果
        """
        try:
            # 计算平台抽成
            platform_fee_amount = profit * self.platform_fee
            
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
                    leader_commissions[chain[0]] = profit * self.leader_commission_1st
                    # 第二代领导人
                    leader_commissions[chain[1]] = profit * self.leader_commission_2nd
            
            # 计算总托管费用
            total_fee = platform_fee_amount + sum(leader_commissions.values())
            
            return {
                'user_id': self.user.id,
                'profit': profit,
                'platform_fee': platform_fee_amount,
                'leader_commissions': leader_commissions,
                'total_fee': total_fee,
                'timestamp': datetime.utcnow()
            }
        except Exception as e:
            logger.error(f"Error calculating custody fee for user {self.user.id}: {str(e)}")
            raise

    async def update_settlement_type(self) -> None:
        """
        更新结算方式
        根据用户服务时长自动更新结算方式
        """
        try:
            if not self.user.service_start_date:
                return

            # 计算服务时长
            service_duration = datetime.utcnow() - self.user.service_start_date
            
            # 如果服务时长超过一个月，更新为日结算
            if service_duration.days >= 30 and self.user.settlement_type == "weekly":
                await self.db.users.update_one(
                    {'_id': self.user.id},
                    {
                        '$set': {
                            'settlement_type': 'daily',
                            'updated_at': datetime.utcnow()
                        }
                    }
                )
                logger.info(f"Updated settlement type to daily for user {self.user.id}")
        except Exception as e:
            logger.error(f"Error updating settlement type for user {self.user.id}: {str(e)}")
            raise

    async def process_settlement(self, profit: Decimal) -> Dict:
        """
        处理结算
        
        Args:
            profit: 交易盈利
            
        Returns:
            Dict: 结算结果
        """
        try:
            # 计算托管费用
            fee_calculation = await self.calculate_custody_fee(profit)
            
            # 更新待结算费用
            await self.db.users.update_one(
                {'_id': self.user.id},
                {
                    '$inc': {
                        'custody_fee_pending': float(fee_calculation['total_fee'])
                    }
                }
            )
            
            # 记录结算历史
            await self.db.settlement_history.insert_one({
                'user_id': self.user.id,
                'profit': float(profit),
                'fee_calculation': fee_calculation,
                'timestamp': datetime.utcnow()
            })
            
            return {
                'status': 'success',
                'fee_calculation': fee_calculation
            }
        except Exception as e:
            logger.error(f"Error processing settlement for user {self.user.id}: {str(e)}")
            raise

    async def settle_pending_fees(self) -> Dict:
        """
        结算待结算费用
        根据结算方式（日/周）进行结算
        """
        try:
            user_info = await self.db.users.find_one({'_id': self.user.id})
            if not user_info:
                raise ValueError("User not found")

            pending_fees = Decimal(str(user_info.get('custody_fee_pending', 0)))
            if pending_fees <= 0:
                return {'status': 'success', 'message': 'No pending fees to settle'}

            # 检查结算条件
            last_settlement = user_info.get('last_settlement_time')
            now = datetime.utcnow()

            if self.user.settlement_type == "weekly":
                # 周结算：检查是否达到结算时间
                if last_settlement and (now - last_settlement).days < 7:
                    return {'status': 'pending', 'message': 'Weekly settlement not due yet'}
            else:
                # 日结算：检查是否达到结算时间
                if last_settlement and (now - last_settlement).days < 1:
                    return {'status': 'pending', 'message': 'Daily settlement not due yet'}

            # 检查托管费用余额是否足够
            custody_fee_balance = Decimal(str(user_info.get('custody_fee_balance', 0)))
            if custody_fee_balance < pending_fees:
                return {
                    'status': 'insufficient_balance',
                    'message': 'Insufficient custody fee balance',
                    'required': float(pending_fees),
                    'available': float(custody_fee_balance)
                }

            # 执行结算
            await self.db.users.update_one(
                {'_id': self.user.id},
                {
                    '$inc': {
                        'custody_fee_balance': -float(pending_fees),
                        'custody_fee_pending': -float(pending_fees)
                    },
                    '$set': {
                        'last_settlement_time': now
                    }
                }
            )

            # 分配费用给平台和领导人
            fee_calculation = await self.calculate_custody_fee(pending_fees)
            
            # 更新平台收益
            if fee_calculation['platform_fee'] > 0:
                await self.db.platform_earnings.insert_one({
                    'amount': float(fee_calculation['platform_fee']),
                    'timestamp': now,
                    'source_user_id': self.user.id
                })

            # 更新领导人收益
            for leader_id, commission in fee_calculation['leader_commissions'].items():
                if commission > 0:
                    await self.db.users.update_one(
                        {'_id': leader_id},
                        {
                            '$inc': {
                                'custody_fee_balance': float(commission)
                            }
                        }
                    )

            return {
                'status': 'success',
                'settled_amount': float(pending_fees),
                'fee_calculation': fee_calculation
            }
        except Exception as e:
            logger.error(f"Error settling pending fees for user {self.user.id}: {str(e)}")
            raise

    async def get_settlement_history(
        self,
        start_time: Optional[datetime] = None,
        end_time: Optional[datetime] = None
    ) -> list:
        """
        获取结算历史
        
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
            
            cursor = self.db.settlement_history.find(query)
            return await cursor.to_list(length=None)
        except Exception as e:
            logger.error(f"Error fetching settlement history for user {self.user.id}: {str(e)}")
            raise 