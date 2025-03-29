from fastapi import APIRouter, Depends, HTTPException
from typing import Dict, List
from datetime import datetime, timedelta
from ..services.fee_service import FeeService
from ..database import get_database
from ..i18n import get_translator
from ..auth import get_current_user

router = APIRouter(prefix="/api/fees", tags=["fees"])

@router.get("/calculate/{user_id}")
async def calculate_fees(
    user_id: str,
    profit: float,
    current_user: Dict = Depends(get_current_user),
    db = Depends(get_database),
    translator = Depends(get_translator)
):
    """计算用户托管费用"""
    fee_service = FeeService(db, translator)
    try:
        return await fee_service.calculate_fees(user_id, profit)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/history/{user_id}")
async def get_fee_history(
    user_id: str,
    start_date: datetime,
    end_date: datetime,
    current_user: Dict = Depends(get_current_user),
    db = Depends(get_database),
    translator = Depends(get_translator)
):
    """获取费用历史记录"""
    fee_service = FeeService(db, translator)
    return await fee_service.get_fee_history(user_id, start_date, end_date)

@router.get("/report/{user_id}")
async def get_fee_report(
    user_id: str,
    period: str = "month",
    current_user: Dict = Depends(get_current_user),
    db = Depends(get_database),
    translator = Depends(get_translator)
):
    """获取费用报告"""
    fee_service = FeeService(db, translator)
    return await fee_service.generate_fee_report(user_id, period)

@router.post("/notify/{user_id}")
async def check_and_notify_fees(
    user_id: str,
    current_balance: float,
    current_user: Dict = Depends(get_current_user),
    db = Depends(get_database),
    translator = Depends(get_translator)
):
    """检查并发送费用提醒"""
    fee_service = FeeService(db, translator)
    await fee_service.check_and_notify_fees(user_id, current_balance)
    return {"message": "Notification sent successfully"} 