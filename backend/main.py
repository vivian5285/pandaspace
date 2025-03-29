from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .api import auth_routes, fund_routes, custody_fee_routes
from .middleware.security import SecurityMiddleware
from .config import settings
import logging

# 配置日志
logging.basicConfig(
    level=settings.LOG_LEVEL,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)

# 创建FastAPI应用
app = FastAPI(
    title=settings.APP_NAME,
    description="Pandaspace - 多链加密货币交易平台",
    version="1.0.0"
)

# 配置CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 在生产环境中应该设置具体的域名
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 添加安全中间件
app.add_middleware(SecurityMiddleware)

# 注册路由
app.include_router(auth_routes.router, prefix=settings.API_V1_STR + "/auth", tags=["认证"])
app.include_router(fund_routes.router, prefix=settings.API_V1_STR + "/fund", tags=["资金"])
app.include_router(custody_fee_routes.router, prefix=settings.API_V1_STR + "/custody-fee", tags=["托管费"])

@app.get("/")
async def root():
    """根路由"""
    return {
        "message": "Welcome to Pandaspace API",
        "version": "1.0.0",
        "docs_url": "/docs",
        "redoc_url": "/redoc"
    }

@app.get("/health")
async def health_check():
    """健康检查"""
    return {"status": "healthy"} 