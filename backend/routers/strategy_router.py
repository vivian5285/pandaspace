from fastapi import APIRouter, Depends, HTTPException
from typing import Dict, List
from datetime import datetime, timedelta
from ..services.strategy_service import StrategyService
from ..database import get_database
from ..i18n import get_translator
from ..auth import get_current_user

router = APIRouter(prefix="/api/strategies", tags=["strategies"])

@router.get("/analyze/{user_id}")
async def analyze_trading_history(
    user_id: str,
    current_user: Dict = Depends(get_current_user),
    db = Depends(get_database),
    translator = Depends(get_translator)
):
    """分析用户交易历史"""
    strategy_service = StrategyService(db, translator)
    try:
        return await strategy_service.analyze_trading_history(user_id)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/recommend/{user_id}")
async def recommend_strategies(
    user_id: str,
    current_user: Dict = Depends(get_current_user),
    db = Depends(get_database),
    translator = Depends(get_translator)
):
    """推荐交易策略"""
    strategy_service = StrategyService(db, translator)
    try:
        return await strategy_service.recommend_strategies(user_id)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/performance/{user_id}")
async def get_performance_report(
    user_id: str,
    period: str = "month",
    current_user: Dict = Depends(get_current_user),
    db = Depends(get_database),
    translator = Depends(get_translator)
):
    """获取性能报告"""
    strategy_service = StrategyService(db, translator)
    try:
        return await strategy_service.generate_performance_report(user_id, period)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e)) 