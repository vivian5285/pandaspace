from typing import Optional, List
from pydantic import BaseModel, Field, EmailStr
from datetime import datetime
from bson import ObjectId
from motor.motor_asyncio import AsyncIOMotorClient
from ..config import settings

class PyObjectId(ObjectId):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v):
        if not ObjectId.is_valid(v):
            raise ValueError("Invalid objectid")
        return ObjectId(v)

    @classmethod
    def __modify_schema__(cls, field_schema):
        field_schema.update(type="string")

class UserBase(BaseModel):
    email: EmailStr
    balance: float = 0.0
    service_fee_balance: float = 0.0
    gift_account_balance: float = 30.0
    status: str = "active"  # active, inactive
    referral_id: Optional[PyObjectId] = None
    registration_date: datetime = datetime.utcnow()
    last_login: Optional[datetime] = None
    is_admin: bool = False

class UserCreate(UserBase):
    password: str

class UserUpdate(BaseModel):
    email: Optional[EmailStr] = None
    balance: Optional[float] = None
    service_fee_balance: Optional[float] = None
    status: Optional[str] = None
    password: Optional[str] = None
    is_admin: Optional[bool] = None

class UserInDB(UserBase):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    hashed_password: str

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}

class User(UserBase):
    id: str = Field(default_factory=PyObjectId, alias="_id")

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}
        schema_extra = {
            "example": {
                "email": "user@example.com",
                "balance": 1000.0,
                "service_fee_balance": 100.0,
                "gift_account_balance": 30.0,
                "referral_id": None,
                "registration_date": "2024-01-01T00:00:00",
                "status": "active",
                "is_admin": False
            }
        }

    @classmethod
    async def find_one(cls, query: dict) -> Optional['User']:
        """查找单个用户"""
        client = AsyncIOMotorClient(settings.MONGODB_URL)
        db = client[settings.MONGODB_DB]
        user_dict = await db.users.find_one(query)
        if user_dict:
            user_dict['id'] = str(user_dict['_id'])
            del user_dict['_id']
            return cls(**user_dict)
        return None

    async def save(self):
        """保存用户"""
        client = AsyncIOMotorClient(settings.MONGODB_URL)
        db = client[settings.MONGODB_DB]
        user_dict = self.dict(exclude={'id'})
        if self.id:
            await db.users.update_one(
                {'_id': self.id},
                {'$set': user_dict}
            )
        else:
            result = await db.users.insert_one(user_dict)
            self.id = str(result.inserted_id)

    async def delete(self):
        """删除用户"""
        if self.id:
            client = AsyncIOMotorClient(settings.MONGODB_URL)
            db = client[settings.MONGODB_DB]
            await db.users.delete_one({'_id': self.id})

class UserResponse(User):
    id: str
    referrer_id: Optional[str] = None
    referrer_chain: Optional[List[str]] = []

    class Config:
        schema_extra = {
            "example": {
                "id": "507f1f77bcf86cd799439011",
                "username": "johndoe",
                "email": "john@example.com",
                "full_name": "John Doe",
                "custody_type": "platform",
                "balance": 10000.0,
                "available_balance": 9000.0,
                "used_margin": 1000.0,
                "custody_fee_balance": 500.0,
                "custody_fee_pending": 0.0,
                "settlement_type": "weekly",
                "risk_level": "medium",
                "max_leverage": 10,
                "max_positions": 5,
                "preferred_strategy": "grid_trading",
                "referrer_id": "507f1f77bcf86cd799439012",
                "referrer_chain": ["507f1f77bcf86cd799439012", "507f1f77bcf86cd799439013"]
            }
        } 