from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt
from passlib.context import CryptContext
from ..models.user import User
from ..config import settings
from .email_service import EmailService
import logging
import secrets

logger = logging.getLogger(__name__)
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
email_service = EmailService()

class AuthService:
    def __init__(self):
        self.secret_key = settings.JWT_SECRET_KEY
        self.algorithm = settings.JWT_ALGORITHM
        self.access_token_expire_minutes = settings.ACCESS_TOKEN_EXPIRE_MINUTES

    def verify_password(self, plain_password: str, hashed_password: str) -> bool:
        """验证密码"""
        return pwd_context.verify(plain_password, hashed_password)

    def get_password_hash(self, password: str) -> str:
        """获取密码哈希"""
        return pwd_context.hash(password)

    def create_access_token(self, data: dict, expires_delta: Optional[timedelta] = None) -> str:
        """创建访问令牌"""
        to_encode = data.copy()
        if expires_delta:
            expire = datetime.utcnow() + expires_delta
        else:
            expire = datetime.utcnow() + timedelta(minutes=15)
        to_encode.update({"exp": expire})
        encoded_jwt = jwt.encode(to_encode, self.secret_key, algorithm=self.algorithm)
        return encoded_jwt

    def verify_token(self, token: str) -> Optional[dict]:
        """验证令牌"""
        try:
            payload = jwt.decode(token, self.secret_key, algorithms=[self.algorithm])
            return payload
        except JWTError:
            return None

    async def register_user(self, email: str, password: str) -> Optional[User]:
        """注册用户"""
        try:
            # 检查邮箱是否已存在
            if await User.find_one({"email": email}):
                raise ValueError("Email already registered")

            # 创建验证令牌
            verification_token = secrets.token_urlsafe(32)
            verification_expires = datetime.utcnow() + timedelta(hours=24)

            # 创建用户
            user = User(
                email=email,
                hashed_password=self.get_password_hash(password),
                is_active=False,
                is_verified=False,
                verification_token=verification_token,
                verification_expires=verification_expires,
                created_at=datetime.utcnow(),
                updated_at=datetime.utcnow()
            )

            # 保存用户
            await user.save()

            # 发送验证邮件
            await email_service.send_verification_email(email, verification_token)

            return user
        except Exception as e:
            logger.error(f"Registration failed: {str(e)}")
            raise

    async def verify_email(self, token: str) -> bool:
        """验证邮箱"""
        try:
            user = await User.find_one({"verification_token": token})
            if not user:
                return False

            if user.verification_expires < datetime.utcnow():
                return False

            user.is_verified = True
            user.is_active = True
            user.verification_token = None
            user.verification_expires = None
            user.updated_at = datetime.utcnow()

            await user.save()
            return True
        except Exception as e:
            logger.error(f"Email verification failed: {str(e)}")
            return False

    async def login(self, email: str, password: str) -> Optional[dict]:
        """用户登录"""
        try:
            user = await User.find_one({"email": email})
            if not user or not self.verify_password(password, user.hashed_password):
                return None

            if not user.is_verified:
                raise ValueError("Email not verified")

            if not user.is_active:
                raise ValueError("Account is inactive")

            # 创建访问令牌
            access_token_expires = timedelta(minutes=self.access_token_expire_minutes)
            access_token = self.create_access_token(
                data={"sub": str(user.id)},
                expires_delta=access_token_expires
            )

            return {
                "access_token": access_token,
                "token_type": "bearer",
                "user": {
                    "id": str(user.id),
                    "email": user.email,
                    "is_active": user.is_active,
                    "is_verified": user.is_verified
                }
            }
        except Exception as e:
            logger.error(f"Login failed: {str(e)}")
            raise

    async def request_password_reset(self, email: str) -> bool:
        """请求密码重置"""
        try:
            user = await User.find_one({"email": email})
            if not user:
                return False

            # 创建重置令牌
            reset_token = secrets.token_urlsafe(32)
            reset_expires = datetime.utcnow() + timedelta(hours=1)

            user.reset_token = reset_token
            user.reset_expires = reset_expires
            user.updated_at = datetime.utcnow()

            await user.save()

            # 发送重置邮件
            await email_service.send_password_reset_email(email, reset_token)

            return True
        except Exception as e:
            logger.error(f"Password reset request failed: {str(e)}")
            return False

    async def reset_password(self, token: str, new_password: str) -> bool:
        """重置密码"""
        try:
            user = await User.find_one({"reset_token": token})
            if not user:
                return False

            if user.reset_expires < datetime.utcnow():
                return False

            user.hashed_password = self.get_password_hash(new_password)
            user.reset_token = None
            user.reset_expires = None
            user.updated_at = datetime.utcnow()

            await user.save()
            return True
        except Exception as e:
            logger.error(f"Password reset failed: {str(e)}")
            return False 