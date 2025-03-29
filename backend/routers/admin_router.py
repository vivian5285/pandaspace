from fastapi import APIRouter, Depends, HTTPException, Query, Body
from fastapi.responses import StreamingResponse
from typing import Dict, List, Optional
from datetime import datetime
from ..services.admin_service import AdminService
from ..database import get_database
from ..i18n import get_translator
from ..auth import get_current_user, check_admin_permission

router = APIRouter(prefix="/api/admin", tags=["admin"])

@router.get("/users")
async def get_all_users(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    search: Optional[str] = None,
    current_user: Dict = Depends(get_current_user),
    db = Depends(get_database),
    translator = Depends(get_translator)
):
    """获取所有用户信息"""
    # 检查管理员权限
    if not check_admin_permission(current_user):
        raise HTTPException(status_code=403, detail="Admin permission required")
    
    admin_service = AdminService(db, translator)
    result = await admin_service.get_all_users(page, page_size, search)
    
    if not result["success"]:
        raise HTTPException(status_code=500, detail=result["message"])
    
    return result["data"]

@router.get("/users/{user_id}")
async def get_user_details(
    user_id: str,
    current_user: Dict = Depends(get_current_user),
    db = Depends(get_database),
    translator = Depends(get_translator)
):
    """获取用户详细信息"""
    # 检查管理员权限
    if not check_admin_permission(current_user):
        raise HTTPException(status_code=403, detail="Admin permission required")
    
    admin_service = AdminService(db, translator)
    result = await admin_service.get_user_details(user_id)
    
    if not result["success"]:
        raise HTTPException(status_code=404, detail=result["message"])
    
    return result["data"]

@router.put("/users/{user_id}/status")
async def update_user_status(
    user_id: str,
    status: str,
    current_user: Dict = Depends(get_current_user),
    db = Depends(get_database),
    translator = Depends(get_translator)
):
    """更新用户状态"""
    # 检查管理员权限
    if not check_admin_permission(current_user):
        raise HTTPException(status_code=403, detail="Admin permission required")
    
    # 验证状态值
    valid_statuses = ["active", "suspended", "banned"]
    if status not in valid_statuses:
        raise HTTPException(status_code=400, detail="Invalid status")
    
    admin_service = AdminService(db, translator)
    result = await admin_service.update_user_status(user_id, status)
    
    if not result["success"]:
        raise HTTPException(status_code=500, detail=result["message"])
    
    return result

@router.post("/users/export")
async def export_users(
    filters: Dict = Body(None),
    current_user: Dict = Depends(get_current_user),
    db = Depends(get_database),
    translator = Depends(get_translator)
):
    """导出用户数据"""
    if not check_admin_permission(current_user):
        raise HTTPException(status_code=403, detail="Admin permission required")
    
    admin_service = AdminService(db, translator)
    result = await admin_service.export_users(filters)
    
    if not result["success"]:
        raise HTTPException(status_code=500, detail=result["message"])
    
    return StreamingResponse(
        iter([result["data"]["csv_content"]]),
        media_type="text/csv",
        headers={
            "Content-Disposition": f"attachment; filename={result['data']['filename']}"
        }
    )

@router.post("/users/batch-status")
async def batch_update_status(
    user_ids: List[str] = Body(...),
    status: str = Body(...),
    current_user: Dict = Depends(get_current_user),
    db = Depends(get_database),
    translator = Depends(get_translator)
):
    """批量更新用户状态"""
    if not check_admin_permission(current_user):
        raise HTTPException(status_code=403, detail="Admin permission required")
    
    valid_statuses = ["active", "suspended", "banned"]
    if status not in valid_statuses:
        raise HTTPException(status_code=400, detail="Invalid status")
    
    admin_service = AdminService(db, translator)
    result = await admin_service.batch_update_status(user_ids, status)
    
    if not result["success"]:
        raise HTTPException(status_code=500, detail=result["message"])
    
    return result

@router.get("/users/{user_id}/logs")
async def get_user_operation_logs(
    user_id: str,
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    current_user: Dict = Depends(get_current_user),
    db = Depends(get_database),
    translator = Depends(get_translator)
):
    """获取用户操作日志"""
    if not check_admin_permission(current_user):
        raise HTTPException(status_code=403, detail="Admin permission required")
    
    admin_service = AdminService(db, translator)
    result = await admin_service.get_user_operation_logs(user_id, page, page_size)
    
    if not result["success"]:
        raise HTTPException(status_code=500, detail=result["message"])
    
    return result["data"]

@router.get("/statistics")
async def get_platform_statistics(
    current_user: Dict = Depends(get_current_user),
    db = Depends(get_database),
    translator = Depends(get_translator)
):
    """获取平台统计数据"""
    if not check_admin_permission(current_user):
        raise HTTPException(status_code=403, detail="Admin permission required")
    
    admin_service = AdminService(db, translator)
    result = await admin_service.get_platform_statistics()
    
    if not result["success"]:
        raise HTTPException(status_code=500, detail=result["message"])
    
    return result["data"]

@router.get("/trends")
async def get_trend_statistics(
    period: str = Query("30d", regex="^(7d|30d|90d)$"),
    current_user: Dict = Depends(get_current_user),
    db = Depends(get_database),
    translator = Depends(get_translator)
):
    """获取趋势统计数据"""
    if not check_admin_permission(current_user):
        raise HTTPException(status_code=403, detail="Admin permission required")
    
    admin_service = AdminService(db, translator)
    result = await admin_service.get_trend_statistics(period)
    
    if not result["success"]:
        raise HTTPException(status_code=500, detail=result["message"])
    
    return result["data"]

@router.post("/users/batch-delete")
async def batch_delete_users(
    user_ids: List[str] = Body(...),
    current_user: Dict = Depends(get_current_user),
    db = Depends(get_database),
    translator = Depends(get_translator)
):
    """批量删除用户"""
    if not check_admin_permission(current_user):
        raise HTTPException(status_code=403, detail="Admin permission required")
    
    admin_service = AdminService(db, translator)
    result = await admin_service.batch_delete_users(user_ids)
    
    if not result["success"]:
        raise HTTPException(status_code=500, detail=result["message"])
    
    return result

@router.post("/users/batch-reset-password")
async def batch_reset_password(
    user_ids: List[str] = Body(...),
    current_user: Dict = Depends(get_current_user),
    db = Depends(get_database),
    translator = Depends(get_translator)
):
    """批量重置密码"""
    if not check_admin_permission(current_user):
        raise HTTPException(status_code=403, detail="Admin permission required")
    
    admin_service = AdminService(db, translator)
    result = await admin_service.batch_reset_password(user_ids)
    
    if not result["success"]:
        raise HTTPException(status_code=500, detail=result["message"])
    
    return result

@router.get("/users/{user_id}/behavior")
async def get_user_behavior_analysis(
    user_id: str,
    current_user: Dict = Depends(get_current_user),
    db = Depends(get_database),
    translator = Depends(get_translator)
):
    """获取用户行为分析"""
    if not check_admin_permission(current_user):
        raise HTTPException(status_code=403, detail="Admin permission required")
    
    admin_service = AdminService(db, translator)
    result = await admin_service.get_user_behavior_analysis(user_id)
    
    if not result["success"]:
        raise HTTPException(status_code=500, detail=result["message"])
    
    return result["data"]

@router.get("/system/performance")
async def get_system_performance(
    current_user: Dict = Depends(get_current_user),
    db = Depends(get_database),
    translator = Depends(get_translator)
):
    """获取系统性能数据"""
    if not check_admin_permission(current_user):
        raise HTTPException(status_code=403, detail="Admin permission required")
    
    admin_service = AdminService(db, translator)
    result = await admin_service.get_system_performance()
    
    if not result["success"]:
        raise HTTPException(status_code=500, detail=result["message"])
    
    return result["data"] 