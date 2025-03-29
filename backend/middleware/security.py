from fastapi import Request, HTTPException
from fastapi.responses import JSONResponse
from datetime import datetime, timedelta
from typing import Dict, List
import logging
from ..config import settings

logger = logging.getLogger(__name__)

class RateLimiter:
    def __init__(self):
        self.requests: Dict[str, List[datetime]] = {}
        self.cleanup_interval = timedelta(minutes=5)
        self.last_cleanup = datetime.now()

    def is_rate_limited(self, ip: str, limit: int, window: timedelta) -> bool:
        now = datetime.now()
        
        # 清理过期的请求记录
        if now - self.last_cleanup > self.cleanup_interval:
            self._cleanup(now)
            self.last_cleanup = now

        # 获取IP的请求记录
        if ip not in self.requests:
            self.requests[ip] = []

        # 清理过期的请求
        self.requests[ip] = [t for t in self.requests[ip] if now - t <= window]

        # 检查是否超过限制
        if len(self.requests[ip]) >= limit:
            return True

        # 添加新的请求记录
        self.requests[ip].append(now)
        return False

    def _cleanup(self, now: datetime):
        """清理过期的请求记录"""
        for ip in list(self.requests.keys()):
            self.requests[ip] = [t for t in self.requests[ip] if now - t <= self.cleanup_interval]
            if not self.requests[ip]:
                del self.requests[ip]

class IPBlocker:
    def __init__(self):
        self.blocked_ips: Dict[str, datetime] = {}
        self.failed_attempts: Dict[str, int] = {}
        self.max_failed_attempts = 5
        self.block_duration = timedelta(hours=1)

    def is_blocked(self, ip: str) -> bool:
        if ip in self.blocked_ips:
            if datetime.now() > self.blocked_ips[ip]:
                del self.blocked_ips[ip]
                return False
            return True
        return False

    def record_failed_attempt(self, ip: str):
        if ip not in self.failed_attempts:
            self.failed_attempts[ip] = 0
        self.failed_attempts[ip] += 1

        if self.failed_attempts[ip] >= self.max_failed_attempts:
            self.blocked_ips[ip] = datetime.now() + self.block_duration
            logger.warning(f"IP {ip} blocked due to multiple failed attempts")

    def record_successful_attempt(self, ip: str):
        if ip in self.failed_attempts:
            del self.failed_attempts[ip]

class SecurityMiddleware:
    def __init__(self):
        self.rate_limiter = RateLimiter()
        self.ip_blocker = IPBlocker()

    async def __call__(self, request: Request, call_next):
        client_ip = request.client.host

        # 检查IP是否被封禁
        if self.ip_blocker.is_blocked(client_ip):
            return JSONResponse(
                status_code=403,
                content={"detail": "IP address is blocked"}
            )

        # 检查请求频率
        if self.rate_limiter.is_rate_limited(client_ip, 100, timedelta(minutes=1)):
            return JSONResponse(
                status_code=429,
                content={"detail": "Too many requests"}
            )

        # 记录请求
        try:
            response = await call_next(request)
            
            # 记录失败的请求
            if response.status_code >= 400:
                self.ip_blocker.record_failed_attempt(client_ip)
            else:
                self.ip_blocker.record_successful_attempt(client_ip)

            return response
        except Exception as e:
            logger.error(f"Request error: {str(e)}")
            self.ip_blocker.record_failed_attempt(client_ip)
            raise 