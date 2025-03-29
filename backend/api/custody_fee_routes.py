from fastapi import APIRouter, Depends, HTTPException
from typing import Dict, List, Optional
from decimal import Decimal
from datetime import datetime
from ..services.custody_fee_manager import CustodyFeeManager
from ..models.user import User
from ..auth import get_current_user

router = APIRouter()

@router.post("/custody-fee/deposit")
async def deposit_custody_fee(
    amount: float,
    current_user: User = Depends(get_current_user)
):
    """充值托管费用"""
    try:
        if amount <= 0:
            raise HTTPException(
                status_code=400,
                detail="Invalid deposit amount"
            )

        # 更新用户托管费用余额
        from ..database import get_database
        db = get_database()
        result = await db.users.update_one(
            {'_id': current_user.id},
            {
                '$inc': {
                    'custody_fee_balance': amount
                }
            }
        )

        if result.modified_count == 0:
            raise HTTPException(
                status_code=500,
                detail="Failed to update custody fee balance"
            )

        # 记录充值历史
        await db.custody_fee_history.insert_one({
            'user_id': current_user.id,
            'amount': amount,
            'type': 'deposit',
            'timestamp': datetime.utcnow()
        })

        return {
            'status': 'success',
            'amount': amount,
            'new_balance': current_user.custody_fee_balance + amount
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/custody-fee/withdraw")
async def withdraw_custody_fee(
    amount: float,
    current_user: User = Depends(get_current_user)
):
    """提现托管费用"""
    try:
        if amount <= 0:
            raise HTTPException(
                status_code=400,
                detail="Invalid withdraw amount"
            )

        if amount > current_user.custody_fee_balance:
            raise HTTPException(
                status_code=400,
                detail="Insufficient custody fee balance"
            )

        # 更新用户托管费用余额
        from ..database import get_database
        db = get_database()
        result = await db.users.update_one(
            {'_id': current_user.id},
            {
                '$inc': {
                    'custody_fee_balance': -amount
                }
            }
        )

        if result.modified_count == 0:
            raise HTTPException(
                status_code=500,
                detail="Failed to update custody fee balance"
            )

        # 记录提现历史
        await db.custody_fee_history.insert_one({
            'user_id': current_user.id,
            'amount': amount,
            'type': 'withdraw',
            'timestamp': datetime.utcnow()
        })

        return {
            'status': 'success',
            'amount': amount,
            'new_balance': current_user.custody_fee_balance - amount
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/custody-fee/balance")
async def get_custody_fee_balance(
    current_user: User = Depends(get_current_user)
):
    """获取托管费用余额信息"""
    try:
        return {
            'balance': current_user.custody_fee_balance,
            'pending': current_user.custody_fee_pending,
            'settlement_type': current_user.settlement_type,
            'last_settlement_time': current_user.last_settlement_time
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/custody-fee/settle")
async def settle_custody_fees(
    current_user: User = Depends(get_current_user)
):
    """结算托管费用"""
    try:
        fee_manager = CustodyFeeManager(current_user)
        result = await fee_manager.settle_pending_fees()
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/custody-fee/history")
async def get_custody_fee_history(
    start_time: Optional[str] = None,
    end_time: Optional[str] = None,
    current_user: User = Depends(get_current_user)
):
    """获取托管费用历史"""
    try:
        start = datetime.fromisoformat(start_time) if start_time else None
        end = datetime.fromisoformat(end_time) if end_time else None

        from ..database import get_database
        db = get_database()
        
        # 获取充值提现历史
        query = {'user_id': current_user.id}
        if start:
            query['timestamp'] = {'$gte': start}
        if end:
            if 'timestamp' in query:
                query['timestamp']['$lte'] = end
            else:
                query['timestamp'] = {'$lte': end}

        fee_history = await db.custody_fee_history.find(query).to_list(length=None)
        
        # 获取结算历史
        fee_manager = CustodyFeeManager(current_user)
        settlement_history = await fee_manager.get_settlement_history(start, end)

        return {
            'fee_history': fee_history,
            'settlement_history': settlement_history
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/custody-fee/summary")
async def get_custody_fee_summary(
    current_user: User = Depends(get_current_user)
):
    """获取托管费用汇总信息"""
    try:
        from ..database import get_database
        db = get_database()

        # 计算总充值金额
        total_deposits = await db.custody_fee_history.aggregate([
            {
                '$match': {
                    'user_id': current_user.id,
                    'type': 'deposit'
                }
            },
            {
                '$group': {
                    '_id': None,
                    'total': {'$sum': '$amount'}
                }
            }
        ]).to_list(length=None)

        # 计算总提现金额
        total_withdrawals = await db.custody_fee_history.aggregate([
            {
                '$match': {
                    'user_id': current_user.id,
                    'type': 'withdraw'
                }
            },
            {
                '$group': {
                    '_id': None,
                    'total': {'$sum': '$amount'}
                }
            }
        ]).to_list(length=None)

        # 计算总结算金额
        total_settlements = await db.settlement_history.aggregate([
            {
                '$match': {
                    'user_id': current_user.id
                }
            },
            {
                '$group': {
                    '_id': None,
                    'total': {'$sum': '$fee_calculation.total_fee'}
                }
            }
        ]).to_list(length=None)

        return {
            'current_balance': current_user.custody_fee_balance,
            'pending_fees': current_user.custody_fee_pending,
            'total_deposits': total_deposits[0]['total'] if total_deposits else 0,
            'total_withdrawals': total_withdrawals[0]['total'] if total_withdrawals else 0,
            'total_settlements': total_settlements[0]['total'] if total_settlements else 0,
            'settlement_type': current_user.settlement_type,
            'last_settlement_time': current_user.last_settlement_time
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) 