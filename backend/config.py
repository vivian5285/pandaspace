from pydantic import BaseSettings
from typing import Optional
import os
from dotenv import load_dotenv

load_dotenv()

class Settings(BaseSettings):
    # 应用设置
    APP_NAME: str = "Pandaspace"
    DEBUG: bool = False
    API_V1_STR: str = "/api/v1"
    
    # 安全设置
    SECRET_KEY: str = os.getenv("SECRET_KEY", "your-secret-key-here")
    JWT_SECRET_KEY: str = os.getenv("JWT_SECRET_KEY", "your-jwt-secret-key-here")
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # 数据库设置
    MONGODB_URL: str = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
    MONGODB_DB: str = os.getenv("MONGODB_DB", "pandaspace")
    
    # 邮件设置
    MAIL_USERNAME: str = os.getenv("MAIL_USERNAME", "")
    MAIL_PASSWORD: str = os.getenv("MAIL_PASSWORD", "")
    MAIL_FROM: str = os.getenv("MAIL_FROM", "noreply@pandaspace.com")
    MAIL_PORT: int = int(os.getenv("MAIL_PORT", "587"))
    MAIL_SERVER: str = os.getenv("MAIL_SERVER", "smtp.gmail.com")
    MAIL_TLS: bool = True
    MAIL_SSL: bool = False
    
    # 前端设置
    FRONTEND_URL: str = os.getenv("FRONTEND_URL", "http://localhost:3000")
    
    # 安全中间件设置
    RATE_LIMIT_PER_MINUTE: int = 60
    MAX_LOGIN_ATTEMPTS: int = 5
    LOGIN_TIMEOUT_MINUTES: int = 30
    
    # 区块链设置
    BSC_RPC_URL: str = os.getenv("BSC_RPC_URL", "https://bsc-dataseed.binance.org")
    ETH_RPC_URL: str = os.getenv("ETH_RPC_URL", "https://mainnet.infura.io/v3/your-project-id")
    TRC_RPC_URL: str = os.getenv("TRC_RPC_URL", "https://api.trongrid.io")
    SOL_RPC_URL: str = os.getenv("SOL_RPC_URL", "https://api.mainnet-beta.solana.com")
    
    # USDT合约地址
    USDT_BSC_ADDRESS: str = os.getenv("USDT_BSC_ADDRESS", "0x55d398326f99059fF775485246999027B3197955")
    USDT_ETH_ADDRESS: str = os.getenv("USDT_ETH_ADDRESS", "0xdAC17F958D2ee523a2206206994597C13D831ec7")
    USDT_TRC_ADDRESS: str = os.getenv("USDT_TRC_ADDRESS", "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t")
    USDT_SOL_ADDRESS: str = os.getenv("USDT_SOL_ADDRESS", "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB")
    
    # 交易设置
    MAX_LEVERAGE: int = 100
    MAX_RISK_PERCENTAGE: float = 5.0
    MIN_RISK_PERCENTAGE: float = 0.1
    DEFAULT_RISK_PERCENTAGE: float = 1.0
    
    # 系统设置
    LOG_LEVEL: str = os.getenv("LOG_LEVEL", "INFO")
    WS_HEARTBEAT_INTERVAL: int = 30
    WS_RECONNECT_INTERVAL: int = 5
    
    # 通知设置
    ENABLE_EMAIL_NOTIFICATIONS: bool = True
    ENABLE_SMS_NOTIFICATIONS: bool = False
    ENABLE_TELEGRAM_NOTIFICATIONS: bool = False
    
    # 风险控制设置
    MAX_POSITIONS_PER_USER: int = 10
    MAX_TOTAL_RISK_PERCENTAGE: float = 20.0
    LIQUIDATION_THRESHOLD: float = 80.0

    class Config:
        case_sensitive = True

settings = Settings() 