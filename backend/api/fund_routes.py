from fastapi import APIRouter, Depends, HTTPException
from typing import Dict, List
from decimal import Decimal
from ..services.fund_manager import FundManager
from ..services.profit_distribution import ProfitDistribution
from ..models.user import User
from ..auth import get_current_user
from ..exchange_client import get_exchange_client

router = APIRouter()

@router.get("/fund/custody-settings")
async def get_custody_settings(
    current_user: User = Depends(get_current_user),
    exchange_client = Depends(get_exchange_client)
):
    """获取用户资金托管设置"""
    try:
        fund_manager = FundManager(current_user, exchange_client)
        await fund_manager.initialize()
        return fund_manager.get_balance_info()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/fund/update-custody")
async def update_custody_settings(
    settings: Dict,
    current_user: User = Depends(get_current_user),
    exchange_client = Depends(get_exchange_client)
):
    """更新用户资金托管设置"""
    try:
        fund_manager = FundManager(current_user, exchange_client)
        await fund_manager.initialize()

        if settings.get('custody_type') == 'exchange':
            # 验证并更新交易所API
            if not all([
                settings.get('exchange_name'),
                settings.get('exchange_api_key'),
                settings.get('exchange_api_secret')
            ]):
                raise HTTPException(
                    status_code=400,
                    detail="Missing required exchange API information"
                )
            
            result = await fund_manager.update_exchange_api(
                settings['exchange_name'],
                settings['exchange_api_key'],
                settings['exchange_api_secret']
            )
        else:
            # 切换到平台托管
            result = {
                'status': 'success',
                'message': 'Switched to platform custody'
            }

        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/fund/deposit")
async def deposit(
    deposit_data: Dict,
    current_user: User = Depends(get_current_user),
    exchange_client = Depends(get_exchange_client)
):
    """用户充值"""
    try:
        fund_manager = FundManager(current_user, exchange_client)
        await fund_manager.initialize()

        if fund_manager.custody_type != 'platform':
            raise HTTPException(
                status_code=400,
                detail="Deposit only available for platform custody"
            )

        amount = Decimal(str(deposit_data.get('amount', 0)))
        if amount <= 0:
            raise HTTPException(
                status_code=400,
                detail="Invalid deposit amount"
            )

        result = await fund_manager.deposit(amount)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/fund/withdraw")
async def withdraw(
    withdraw_data: Dict,
    current_user: User = Depends(get_current_user),
    exchange_client = Depends(get_exchange_client)
):
    """用户提现"""
    try:
        fund_manager = FundManager(current_user, exchange_client)
        await fund_manager.initialize()

        if fund_manager.custody_type != 'platform':
            raise HTTPException(
                status_code=400,
                detail="Withdraw only available for platform custody"
            )

        amount = Decimal(str(withdraw_data.get('amount', 0)))
        if amount <= 0:
            raise HTTPException(
                status_code=400,
                detail="Invalid withdraw amount"
            )

        result = await fund_manager.withdraw(amount)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/fund/balance")
async def get_balance(
    current_user: User = Depends(get_current_user),
    exchange_client = Depends(get_exchange_client)
):
    """获取用户余额信息"""
    try:
        fund_manager = FundManager(current_user, exchange_client)
        await fund_manager.initialize()
        return fund_manager.get_balance_info()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/fund/deposit-history")
async def get_deposit_history(
    current_user: User = Depends(get_current_user),
    exchange_client = Depends(get_exchange_client)
):
    """获取充值历史"""
    try:
        fund_manager = FundManager(current_user, exchange_client)
        await fund_manager.initialize()

        if fund_manager.custody_type != 'platform':
            raise HTTPException(
                status_code=400,
                detail="Deposit history only available for platform custody"
            )

        from ..database import get_database
        db = get_database()
        history = await db.deposit_history.find(
            {'user_id': current_user.id}
        ).to_list(length=None)
        return history
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/fund/withdraw-history")
async def get_withdraw_history(
    current_user: User = Depends(get_current_user),
    exchange_client = Depends(get_exchange_client)
):
    """获取提现历史"""
    try:
        fund_manager = FundManager(current_user, exchange_client)
        await fund_manager.initialize()

        if fund_manager.custody_type != 'platform':
            raise HTTPException(
                status_code=400,
                detail="Withdraw history only available for platform custody"
            )

        from ..database import get_database
        db = get_database()
        history = await db.withdraw_history.find(
            {'user_id': current_user.id}
        ).to_list(length=None)
        return history
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/fund/profit-history")
async def get_profit_history(
    start_time: str = None,
    end_time: str = None,
    current_user: User = Depends(get_current_user),
    exchange_client = Depends(get_exchange_client)
):
    """获取收益分配历史"""
    try:
        from datetime import datetime
        start = datetime.fromisoformat(start_time) if start_time else None
        end = datetime.fromisoformat(end_time) if end_time else None

        from ..database import get_database
        db = get_database()
        history = await db.profit_distribution_history.find(
            {
                'user_id': current_user.id,
                **({'timestamp': {'$gte': start}} if start else {}),
                **({'timestamp': {'$lte': end}} if end else {})
            }
        ).to_list(length=None)
        return history
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) 