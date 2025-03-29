from fastapi import APIRouter, Depends, HTTPException
from typing import Dict, List
from datetime import datetime, timedelta
from ..services.performance_service import PerformanceService
from ..database import get_database
from ..i18n import get_translator
from ..auth import get_current_user

router = APIRouter(prefix="/api/performance", tags=["performance"])

@router.get("/system")
async def get_system_performance(
    current_user: Dict = Depends(get_current_user),
    db = Depends(get_database),
    translator = Depends(get_translator)
):
    """获取系统性能指标"""
    performance_service = PerformanceService(db, translator)
    return await performance_service.monitor_system_performance()

@router.post("/optimize/query")
async def optimize_database_query(
    query: Dict,
    current_user: Dict = Depends(get_current_user),
    db = Depends(get_database),
    translator = Depends(get_translator)
):
    """优化数据库查询"""
    performance_service = PerformanceService(db, translator)
    return await performance_service.optimize_database_queries(query)

@router.get("/api/{endpoint}")
async def get_api_performance(
    endpoint: str,
    current_user: Dict = Depends(get_current_user),
    db = Depends(get_database),
    translator = Depends(get_translator)
):
    """获取API性能指标"""
    performance_service = PerformanceService(db, translator)
    return await performance_service.monitor_api_performance(endpoint)

@router.get("/frontend")
async def get_frontend_performance(
    current_user: Dict = Depends(get_current_user),
    db = Depends(get_database),
    translator = Depends(get_translator)
):
    """获取前端性能指标"""
    performance_service = PerformanceService(db, translator)
    return await performance_service.optimize_frontend_assets()

@router.post("/cache")
async def cache_data(
    key: str,
    data: Dict,
    current_user: Dict = Depends(get_current_user),
    db = Depends(get_database),
    translator = Depends(get_translator)
):
    """缓存数据"""
    performance_service = PerformanceService(db, translator)
    await performance_service.cache_frequently_accessed_data(key, data)
    return {"message": "Data cached successfully"}

@router.get("/cache/{key}")
async def get_cached_data(
    key: str,
    current_user: Dict = Depends(get_current_user),
    db = Depends(get_database),
    translator = Depends(get_translator)
):
    """获取缓存数据"""
    performance_service = PerformanceService(db, translator)
    data = await performance_service.get_cached_data(key)
    if data is None:
        raise HTTPException(status_code=404, detail="Cache miss")
    return data 