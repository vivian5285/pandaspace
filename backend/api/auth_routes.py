from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from typing import Optional
from ..services.auth_service import AuthService
from ..models.user import User
from ..schemas.auth import (
    UserCreate,
    UserLogin,
    Token,
    PasswordResetRequest,
    PasswordReset
)
from ..middleware.security import SecurityMiddleware
import logging

logger = logging.getLogger(__name__)
router = APIRouter()
auth_service = AuthService()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")
security_middleware = SecurityMiddleware()

async def get_current_user(token: str = Depends(oauth2_scheme)) -> User:
    """获取当前用户"""
    payload = auth_service.verify_token(token)
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    user = await User.find_one({"_id": payload["sub"]})
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return user

@router.post("/register", response_model=dict)
async def register(user_data: UserCreate):
    """用户注册"""
    try:
        user = await auth_service.register_user(user_data.email, user_data.password)
        return {"message": "Registration successful. Please check your email to verify your account."}
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        logger.error(f"Registration failed: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Registration failed"
        )

@router.post("/verify-email/{token}", response_model=dict)
async def verify_email(token: str):
    """验证邮箱"""
    success = await auth_service.verify_email(token)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired verification token"
        )
    return {"message": "Email verified successfully"}

@router.post("/token", response_model=Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    """用户登录"""
    try:
        result = await auth_service.login(form_data.username, form_data.password)
        if not result:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect email or password",
                headers={"WWW-Authenticate": "Bearer"},
            )
        return result
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        logger.error(f"Login failed: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Login failed"
        )

@router.post("/password-reset-request", response_model=dict)
async def request_password_reset(request: PasswordResetRequest):
    """请求密码重置"""
    success = await auth_service.request_password_reset(request.email)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    return {"message": "Password reset email sent"}

@router.post("/password-reset", response_model=dict)
async def reset_password(reset_data: PasswordReset):
    """重置密码"""
    success = await auth_service.reset_password(reset_data.token, reset_data.new_password)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired reset token"
        )
    return {"message": "Password reset successfully"}

@router.get("/me", response_model=dict)
async def get_current_user_info(current_user: User = Depends(get_current_user)):
    """获取当前用户信息"""
    return {
        "id": str(current_user.id),
        "email": current_user.email,
        "is_active": current_user.is_active,
        "is_verified": current_user.is_verified,
        "created_at": current_user.created_at
    } 