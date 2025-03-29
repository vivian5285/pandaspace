from fastapi import APIRouter, Depends, HTTPException, Query
from typing import List, Optional
from datetime import datetime
from ..models.user import User, UserUpdate, UserCreate
from ..database import get_database
from ..auth import get_current_admin_user
from ..i18n import get_translator

router = APIRouter(prefix="/admin", tags=["admin"])

@router.get("/users", response_model=List[User])
async def get_users(
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    search: Optional[str] = None,
    status: Optional[str] = None,
    db = Depends(get_database),
    current_user: User = Depends(get_current_admin_user),
    translator = Depends(get_translator)
):
    """
    获取用户列表，支持分页、搜索和状态过滤
    """
    query = {}
    
    if search:
        query["email"] = {"$regex": search, "$options": "i"}
    if status:
        query["status"] = status
        
    users = await db.users.find(query).skip(skip).limit(limit).to_list(length=None)
    return users

@router.get("/users/{user_id}", response_model=User)
async def get_user(
    user_id: str,
    db = Depends(get_database),
    current_user: User = Depends(get_current_admin_user),
    translator = Depends(get_translator)
):
    """
    获取单个用户的详细信息
    """
    user = await db.users.find_one({"_id": user_id})
    if not user:
        raise HTTPException(status_code=404, detail=translator.get("user_not_found"))
    return user

@router.put("/users/{user_id}", response_model=User)
async def update_user(
    user_id: str,
    user_update: UserUpdate,
    db = Depends(get_database),
    current_user: User = Depends(get_current_admin_user),
    translator = Depends(get_translator)
):
    """
    更新用户信息
    """
    update_data = user_update.dict(exclude_unset=True)
    if not update_data:
        raise HTTPException(status_code=400, detail=translator.get("no_update_data"))
        
    result = await db.users.find_one_and_update(
        {"_id": user_id},
        {"$set": update_data},
        return_document=True
    )
    if not result:
        raise HTTPException(status_code=404, detail=translator.get("user_not_found"))
    return result

@router.delete("/users/{user_id}")
async def delete_user(
    user_id: str,
    db = Depends(get_database),
    current_user: User = Depends(get_current_admin_user),
    translator = Depends(get_translator)
):
    """
    删除用户
    """
    result = await db.users.delete_one({"_id": user_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail=translator.get("user_not_found"))
    return {"message": translator.get("user_deleted")}

@router.post("/users", response_model=User)
async def create_user(
    user: UserCreate,
    db = Depends(get_database),
    current_user: User = Depends(get_current_admin_user),
    translator = Depends(get_translator)
):
    """
    创建新用户
    """
    # 检查邮箱是否已存在
    if await db.users.find_one({"email": user.email}):
        raise HTTPException(status_code=400, detail=translator.get("email_exists"))
        
    # 创建用户文档
    user_dict = user.dict()
    user_dict["hashed_password"] = user.password  # 实际应用中需要哈希处理
    user_dict["registration_date"] = datetime.utcnow()
    
    result = await db.users.insert_one(user_dict)
    created_user = await db.users.find_one({"_id": result.inserted_id})
    return created_user 