from fastapi import APIRouter, Depends, HTTPException
from typing import Dict, List
from datetime import datetime
from ..services.gift_account_service import GiftAccountService
from ..database import get_database
from ..i18n import get_translator
from ..auth import get_current_user

router = APIRouter(prefix="/api/gift", tags=["gift"])

@router.get("/rules")
async def get_gift_rules(
    current_user: Dict = Depends(get_current_user),
    db = Depends(get_database),
    translator = Depends(get_translator)
):
    """获取赠送账户使用规则"""
    gift_service = GiftAccountService(db, translator)
    return await gift_service.get_gift_rules()

@router.get("/notifications")
async def get_gift_notifications(
    current_user: Dict = Depends(get_current_user),
    db = Depends(get_database),
    translator = Depends(get_translator)
):
    """获取赠送账户通知"""
    try:
        notifications = await db.notifications.find({
            "user_id": current_user["id"],
            "type": {"$in": ["gift_account_created", "gift_balance_used", "gift_balance_low"]}
        }).sort("created_at", -1).to_list(length=None)
        
        return notifications
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/balance")
async def get_gift_balance(
    current_user: Dict = Depends(get_current_user),
    db = Depends(get_database),
    translator = Depends(get_translator)
):
    """获取赠送账户余额"""
    gift_service = GiftAccountService(db, translator)
    balance = await gift_service.get_gift_balance(current_user["id"])
    if balance is None:
        raise HTTPException(status_code=404, detail="Gift account not found")
    return {"balance": balance}

@router.get("/transactions")
async def get_gift_transactions(
    current_user: Dict = Depends(get_current_user),
    db = Depends(get_database),
    translator = Depends(get_translator)
):
    """获取赠送账户交易记录"""
    gift_service = GiftAccountService(db, translator)
    transactions = await gift_service.get_gift_transactions(current_user["id"])
    return transactions 