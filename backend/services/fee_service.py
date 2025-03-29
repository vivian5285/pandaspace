from datetime import datetime, timedelta
from typing import List, Dict
from ..models.user import User
from ..database import get_database
from ..i18n import get_translator
from .gift_account_service import GiftAccountService

class FeeService:
    def __init__(self, db, translator):
        self.db = db
        self.translator = translator
        self.gift_account_service = GiftAccountService(db, translator)
        self.PLATFORM_FEE_RATE = 0.10  # 平台抽成比例
        self.LEADER_FEE_RATE = 0.20   # 领导人抽成比例
        self.SECOND_LEADER_FEE_RATE = 0.10  # 第二代领导人抽成比例
        self.FEE_THRESHOLD = 100.0  # 费用提醒阈值

    async def calculate_fees(self, user_id: str, profit: float) -> Dict:
        """计算用户托管费用"""
        try:
            # 计算各项费用
            platform_fee = profit * self.PLATFORM_FEE_RATE
            leader_fee = profit * self.LEADER_FEE_RATE
            second_leader_fee = profit * self.SECOND_LEADER_FEE_RATE
            total_fee = platform_fee + leader_fee + second_leader_fee

            # 获取用户信息
            user = await self.db.users.find_one({"_id": user_id})
            if not user:
                return {
                    "success": False,
                    "message": self.translator.get("user_not_found")
                }

            # 获取赠送账户余额
            gift_balance = await self.gift_account_service.get_gift_balance(user_id)
            if gift_balance is None:
                return {
                    "success": False,
                    "message": self.translator.get("gift_account_error")
                }

            # 计算实际需要从托管账户扣除的费用
            remaining_fee = total_fee
            gift_used = 0

            # 优先使用赠送账户余额
            if gift_balance > 0:
                gift_used = min(gift_balance, total_fee)
                remaining_fee = total_fee - gift_used
                
                # 使用赠送账户余额
                gift_result = await self.gift_account_service.use_gift_balance(user_id, gift_used)
                if not gift_result["success"]:
                    return gift_result

            # 更新托管费用余额
            if remaining_fee > 0:
                result = await self.db.users.update_one(
                    {"_id": user_id},
                    {
                        "$inc": {"service_fee_balance": -remaining_fee},
                        "$push": {
                            "fee_transactions": {
                                "amount": -remaining_fee,
                                "type": "fee_payment",
                                "timestamp": datetime.now(),
                                "details": {
                                    "platform_fee": platform_fee,
                                    "leader_fee": leader_fee,
                                    "second_leader_fee": second_leader_fee,
                                    "gift_used": gift_used
                                }
                            }
                        }
                    }
                )
                if not result.modified_count:
                    return {
                        "success": False,
                        "message": self.translator.get("fee_update_failed")
                    }

            return {
                "success": True,
                "message": self.translator.get("fees_calculated"),
                "data": {
                    "platform_fee": platform_fee,
                    "leader_fee": leader_fee,
                    "second_leader_fee": second_leader_fee,
                    "total_fee": total_fee,
                    "gift_used": gift_used,
                    "remaining_fee": remaining_fee,
                    "current_balance": user.get("service_fee_balance", 0) - remaining_fee,
                    "gift_balance": gift_balance - gift_used
                }
            }
        except Exception as e:
            return {
                "success": False,
                "message": str(e)
            }

    async def check_and_notify_fees(self, user_id: str, current_balance: float) -> Dict:
        """检查并发送费用提醒"""
        try:
            if current_balance < self.FEE_THRESHOLD:
                # 获取用户信息
                user = await self.db.users.find_one({"_id": user_id})
                if not user:
                    return {
                        "success": False,
                        "message": self.translator.get("user_not_found")
                    }

                # 获取赠送账户余额
                gift_balance = await self.gift_account_service.get_gift_balance(user_id)
                if gift_balance is None:
                    return {
                        "success": False,
                        "message": self.translator.get("gift_account_error")
                    }

                # 发送提醒
                notification = {
                    "user_id": user_id,
                    "type": "fee_reminder",
                    "message": self.translator.get("fee_balance_low"),
                    "data": {
                        "current_balance": current_balance,
                        "gift_balance": gift_balance,
                        "threshold": self.FEE_THRESHOLD
                    },
                    "created_at": datetime.now()
                }

                await self.db.notifications.insert_one(notification)
                return {
                    "success": True,
                    "message": self.translator.get("notification_sent")
                }
            return {
                "success": True,
                "message": self.translator.get("balance_sufficient")
            }
        except Exception as e:
            return {
                "success": False,
                "message": str(e)
            }

    async def get_fee_history(self, user_id: str, start_date: datetime, end_date: datetime) -> List[Dict]:
        """获取费用历史记录"""
        try:
            user = await self.db.users.find_one({"_id": user_id})
            if not user:
                return []

            fee_transactions = user.get("fee_transactions", [])
            gift_transactions = await self.gift_account_service.get_gift_transactions(user_id)

            # 合并并过滤交易记录
            all_transactions = []
            for transaction in fee_transactions + gift_transactions:
                if start_date <= transaction["timestamp"] <= end_date:
                    all_transactions.append(transaction)

            # 按时间排序
            all_transactions.sort(key=lambda x: x["timestamp"], reverse=True)
            return all_transactions
        except Exception:
            return []

    async def generate_fee_report(self, user_id: str, period: str = "month") -> Dict:
        """生成费用报告"""
        try:
            # 计算时间范围
            end_date = datetime.now()
            if period == "day":
                start_date = end_date - timedelta(days=1)
            elif period == "week":
                start_date = end_date - timedelta(weeks=1)
            else:  # month
                start_date = end_date - timedelta(days=30)

            # 获取费用历史
            transactions = await self.get_fee_history(user_id, start_date, end_date)

            # 计算统计数据
            total_fees = sum(t["amount"] for t in transactions if t["type"] == "fee_payment")
            platform_fees = sum(t["details"]["platform_fee"] for t in transactions if "details" in t)
            leader_fees = sum(t["details"]["leader_fee"] for t in transactions if "details" in t)
            gift_used = sum(t["details"]["gift_used"] for t in transactions if "details" in t)

            return {
                "success": True,
                "data": {
                    "period": period,
                    "start_date": start_date,
                    "end_date": end_date,
                    "total_fees": total_fees,
                    "platform_fees": platform_fees,
                    "leader_fees": leader_fees,
                    "gift_used": gift_used,
                    "transactions": transactions
                }
            }
        except Exception as e:
            return {
                "success": False,
                "message": str(e)
            } 