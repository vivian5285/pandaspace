from fastapi import APIRouter, Depends, HTTPException
from typing import Dict, List
from decimal import Decimal
from ..services.position_manager import PositionManager
from ..models.user import User
from ..auth import get_current_user
from ..exchange_client import get_exchange_client

router = APIRouter()

@router.get("/positions/summary")
async def get_position_summary(
    current_user: User = Depends(get_current_user),
    exchange_client = Depends(get_exchange_client)
):
    """获取用户仓位摘要"""
    try:
        position_manager = PositionManager(current_user.id, exchange_client)
        await position_manager.update_balance()
        return position_manager.get_position_summary()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/positions/risk-metrics")
async def get_position_risk_metrics(
    current_user: User = Depends(get_current_user),
    exchange_client = Depends(get_exchange_client)
):
    """获取仓位风险指标"""
    try:
        position_manager = PositionManager(current_user.id, exchange_client)
        await position_manager.update_balance()
        return position_manager.get_position_risk_metrics()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/positions/open")
async def open_position(
    position_data: Dict,
    current_user: User = Depends(get_current_user),
    exchange_client = Depends(get_exchange_client)
):
    """开仓"""
    try:
        position_manager = PositionManager(current_user.id, exchange_client)
        await position_manager.update_balance()
        
        # 验证请求数据
        required_fields = ['symbol', 'side', 'leverage', 'risk_percentage']
        for field in required_fields:
            if field not in position_data:
                raise HTTPException(
                    status_code=400,
                    detail=f"Missing required field: {field}"
                )
        
        # 获取当前市场价格
        market_price = await exchange_client.get_symbol_price(position_data['symbol'])
        
        # 开仓
        position_info = await position_manager.open_position(
            symbol=position_data['symbol'],
            side=position_data['side'],
            leverage=position_data['leverage'],
            risk_percentage=position_data['risk_percentage'],
            market_price=market_price
        )
        
        return position_info
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/positions/{symbol}/close")
async def close_position(
    symbol: str,
    current_user: User = Depends(get_current_user),
    exchange_client = Depends(get_exchange_client)
):
    """平仓"""
    try:
        position_manager = PositionManager(current_user.id, exchange_client)
        await position_manager.update_balance()
        
        # 验证仓位是否存在
        if symbol not in position_manager.positions:
            raise HTTPException(
                status_code=404,
                detail=f"No open position for {symbol}"
            )
        
        # 平仓
        position_info = await position_manager.close_position(symbol)
        return position_info
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/positions/leverage-options")
async def get_leverage_options(
    symbol: str,
    current_user: User = Depends(get_current_user),
    exchange_client = Depends(get_exchange_client)
):
    """获取可用的杠杆选项"""
    try:
        position_manager = PositionManager(current_user.id, exchange_client)
        await position_manager.update_balance()
        
        # 获取交易所支持的杠杆选项
        leverage_options = await exchange_client.get_leverage_options(symbol)
        
        # 根据用户余额和风险偏好过滤杠杆选项
        filtered_options = []
        for leverage in leverage_options:
            # 计算使用该杠杆时的最大仓位
            max_position = position_manager.calculate_position_size(
                symbol,
                leverage,
                0.1,  # 最大风险比例
                await exchange_client.get_symbol_price(symbol)
            )
            
            # 如果最大仓位在合理范围内，添加该杠杆选项
            if max_position['margin_required'] <= position_manager.available_balance:
                filtered_options.append({
                    'leverage': leverage,
                    'max_position': max_position['leveraged_position_size'],
                    'margin_required': max_position['margin_required']
                })
        
        return filtered_options
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/positions/risk-calculator")
async def calculate_position_risk(
    symbol: str,
    leverage: int,
    risk_percentage: float,
    current_user: User = Depends(get_current_user),
    exchange_client = Depends(get_exchange_client)
):
    """计算仓位风险"""
    try:
        position_manager = PositionManager(current_user.id, exchange_client)
        await position_manager.update_balance()
        
        # 获取当前市场价格
        market_price = await exchange_client.get_symbol_price(symbol)
        
        # 计算仓位信息
        position_info = position_manager.calculate_position_size(
            symbol,
            leverage,
            risk_percentage,
            market_price
        )
        
        # 验证仓位是否有效
        is_valid = position_manager.validate_position(position_info)
        
        return {
            'position_info': position_info,
            'is_valid': is_valid,
            'risk_level': 'high' if risk_percentage > 0.05 else 'medium' if risk_percentage > 0.02 else 'low'
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) 