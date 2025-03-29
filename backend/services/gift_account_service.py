from typing import Dict, Optional
from datetime import datetime
from ..database import get_database
from ..i18n import get_translator

class GiftAccountService:
    def __init__(self, db, translator):
        self.db = db
        self.translator = translator
        self.GIFT_AMOUNT = 30.0  # 默认赠送金额
        self.BALANCE_CHANGE_THRESHOLD = 5.0  # 余额变动通知阈值

    async def create_gift_account(self, user_id: str) -> Dict:
        """为新用户创建赠送账户"""
        try:
            result = await self.db.users.update_one(
                {"_id": user_id},
                {
                    "$set": {
                        "gift_account_balance": self.GIFT_AMOUNT,
                        "gift_account_created_at": datetime.now()
                    }
                }
            )
            if result.modified_count:
                # 发送赠送账户创建通知
                await self._send_balance_notification(
                    user_id,
                    "gift_account_created",
                    self.GIFT_AMOUNT,
                    self.GIFT_AMOUNT
                )
                return {
                    "success": True,
                    "message": self.translator.get("gift_account_created"),
                    "gift_balance": self.GIFT_AMOUNT
                }
            return {
                "success": False,
                "message": self.translator.get("gift_account_creation_failed")
            }
        except Exception as e:
            return {
                "success": False,
                "message": str(e)
            }

    async def get_gift_balance(self, user_id: str) -> Optional[float]:
        """获取用户赠送账户余额"""
        try:
            user = await self.db.users.find_one({"_id": user_id})
            return user.get("gift_account_balance", 0.0) if user else None
        except Exception:
            return None

    async def use_gift_balance(self, user_id: str, amount: float) -> Dict:
        """使用赠送账户余额"""
        try:
            user = await self.db.users.find_one({"_id": user_id})
            if not user:
                return {
                    "success": False,
                    "message": self.translator.get("user_not_found")
                }

            current_balance = user.get("gift_account_balance", 0.0)
            if current_balance < amount:
                return {
                    "success": False,
                    "message": self.translator.get("insufficient_gift_balance")
                }

            result = await self.db.users.update_one(
                {"_id": user_id},
                {
                    "$inc": {"gift_account_balance": -amount},
                    "$push": {
                        "gift_account_transactions": {
                            "amount": -amount,
                            "type": "fee_payment",
                            "timestamp": datetime.now()
                        }
                    }
                }
            )

            if result.modified_count:
                # 检查余额变动是否超过阈值
                if amount >= self.BALANCE_CHANGE_THRESHOLD:
                    await self._send_balance_notification(
                        user_id,
                        "gift_balance_used",
                        current_balance - amount,
                        amount
                    )
                return {
                    "success": True,
                    "message": self.translator.get("gift_balance_used"),
                    "remaining_balance": current_balance - amount
                }
            return {
                "success": False,
                "message": self.translator.get("gift_balance_update_failed")
            }
        except Exception as e:
            return {
                "success": False,
                "message": str(e)
            }

    async def get_gift_transactions(self, user_id: str) -> list:
        """获取赠送账户交易记录"""
        try:
            user = await self.db.users.find_one({"_id": user_id})
            return user.get("gift_account_transactions", []) if user else []
        except Exception:
            return []

    async def validate_gift_usage(self, user_id: str, amount: float) -> bool:
        """验证赠送账户余额是否足够"""
        try:
            balance = await self.get_gift_balance(user_id)
            return balance is not None and balance >= amount
        except Exception:
            return False

    async def _send_balance_notification(self, user_id: str, notification_type: str, current_balance: float, amount: float):
        """发送余额变动通知"""
        try:
            notification = {
                "user_id": user_id,
                "type": notification_type,
                "message": self.translator.get(f"{notification_type}_message", {
                    "amount": amount,
                    "balance": current_balance
                }),
                "data": {
                    "current_balance": current_balance,
                    "amount": amount,
                    "timestamp": datetime.now()
                },
                "created_at": datetime.now()
            }
            await self.db.notifications.insert_one(notification)
        except Exception:
            pass  # 通知发送失败不影响主要业务逻辑

    async def get_gift_rules(self) -> Dict:
        """获取赠送账户使用规则"""
        return {
            "rules": [
                {
                    "title": self.translator.get("gift_rule_title_1"),
                    "content": self.translator.get("gift_rule_content_1")
                },
                {
                    "title": self.translator.get("gift_rule_title_2"),
                    "content": self.translator.get("gift_rule_content_2")
                },
                {
                    "title": self.translator.get("gift_rule_title_3"),
                    "content": self.translator.get("gift_rule_content_3")
                }
            ],
            "notifications": {
                "balance_threshold": self.BALANCE_CHANGE_THRESHOLD,
                "low_balance_warning": self.translator.get("gift_balance_low_warning")
            }
        } 