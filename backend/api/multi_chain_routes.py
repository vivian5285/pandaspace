from fastapi import APIRouter, Depends, HTTPException
from typing import Dict, List, Optional
from decimal import Decimal
from datetime import datetime
from ..services.multi_chain_wallet import MultiChainWallet
from ..models.user import User
from ..auth import get_current_user

router = APIRouter()

@router.post("/deposit/address")
async def create_deposit_address(
    chain: str,
    current_user: User = Depends(get_current_user)
):
    """创建充值地址"""
    try:
        wallet = MultiChainWallet()
        result = await wallet.create_deposit_address(current_user, chain)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/deposit/addresses")
async def get_deposit_addresses(
    current_user: User = Depends(get_current_user)
):
    """获取用户的充值地址列表"""
    try:
        wallet = MultiChainWallet()
        addresses = await wallet.get_deposit_addresses(current_user)
        return addresses
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/deposit/verify")
async def verify_deposit(
    chain: str,
    tx_hash: str,
    current_user: User = Depends(get_current_user)
):
    """验证充值交易"""
    try:
        wallet = MultiChainWallet()
        # 获取交易详情
        tx = await wallet.verify_transaction(chain, tx_hash)
        if not tx:
            raise HTTPException(
                status_code=400,
                detail="Invalid transaction"
            )
        
        # 获取交易金额
        amount = await wallet.get_transaction_amount(chain, tx_hash)
        if not amount:
            raise HTTPException(
                status_code=400,
                detail="Invalid transaction amount"
            )
        
        # 处理充值
        result = await wallet.process_deposit(current_user, chain, amount, tx_hash)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/withdraw")
async def withdraw(
    chain: str,
    amount: float,
    to_address: str,
    current_user: User = Depends(get_current_user)
):
    """提现"""
    try:
        if amount <= 0:
            raise HTTPException(
                status_code=400,
                detail="Invalid withdrawal amount"
            )
        
        # 验证提现地址
        if not await wallet.validate_address(chain, to_address):
            raise HTTPException(
                status_code=400,
                detail="Invalid withdrawal address"
            )
        
        # 处理提现
        wallet = MultiChainWallet()
        result = await wallet.process_withdrawal(
            current_user,
            chain,
            Decimal(str(amount)),
            to_address
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/transactions")
async def get_transaction_history(
    chain: Optional[str] = None,
    start_time: Optional[str] = None,
    end_time: Optional[str] = None,
    current_user: User = Depends(get_current_user)
):
    """获取交易历史"""
    try:
        start = datetime.fromisoformat(start_time) if start_time else None
        end = datetime.fromisoformat(end_time) if end_time else None
        
        wallet = MultiChainWallet()
        history = await wallet.get_transaction_history(
            current_user,
            chain,
            start,
            end
        )
        return history
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/chains")
async def get_supported_chains():
    """获取支持的链列表"""
    try:
        wallet = MultiChainWallet()
        return {
            'chains': [
                {
                    'name': 'BSC',
                    'display_name': 'Binance Smart Chain',
                    'token': 'USDT',
                    'decimals': 18
                },
                {
                    'name': 'ETH',
                    'display_name': 'Ethereum',
                    'token': 'USDT',
                    'decimals': 6
                },
                {
                    'name': 'TRC',
                    'display_name': 'Tron',
                    'token': 'USDT',
                    'decimals': 6
                },
                {
                    'name': 'SOL',
                    'display_name': 'Solana',
                    'token': 'USDT',
                    'decimals': 6
                }
            ]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/chain/{chain}/status")
async def get_chain_status(chain: str):
    """获取链的状态"""
    try:
        wallet = MultiChainWallet()
        status = await wallet.get_chain_status(chain)
        return status
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) 