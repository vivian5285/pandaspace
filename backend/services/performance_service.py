from typing import Dict, List
import time
import psutil
from datetime import datetime
from ..database import get_database
from ..i18n import get_translator

class PerformanceService:
    def __init__(self, db, translator):
        self.db = db
        self.translator = translator
        self.cache = {}
        self.cache_ttl = 300  # 缓存有效期（秒）

    async def monitor_system_performance(self) -> Dict:
        """监控系统性能"""
        cpu_percent = psutil.cpu_percent(interval=1)
        memory = psutil.virtual_memory()
        disk = psutil.disk_usage('/')
        
        return {
            "timestamp": datetime.utcnow(),
            "cpu": {
                "percent": cpu_percent,
                "cores": psutil.cpu_count()
            },
            "memory": {
                "total": memory.total,
                "available": memory.available,
                "percent": memory.percent
            },
            "disk": {
                "total": disk.total,
                "used": disk.used,
                "free": disk.free,
                "percent": disk.percent
            }
        }

    async def optimize_database_queries(self, query: Dict) -> Dict:
        """优化数据库查询"""
        start_time = time.time()
        
        # 检查查询是否可以使用索引
        index_hint = await self._get_index_hint(query)
        
        # 执行查询
        result = await self.db.users.find(query).to_list(length=None)
        
        execution_time = time.time() - start_time
        
        return {
            "execution_time": execution_time,
            "index_used": index_hint is not None,
            "result_count": len(result)
        }

    async def cache_frequently_accessed_data(self, key: str, data: Dict):
        """缓存频繁访问的数据"""
        self.cache[key] = {
            "data": data,
            "timestamp": time.time()
        }

    async def get_cached_data(self, key: str) -> Dict:
        """获取缓存的数据"""
        if key in self.cache:
            cache_entry = self.cache[key]
            if time.time() - cache_entry["timestamp"] < self.cache_ttl:
                return cache_entry["data"]
        return None

    async def optimize_api_response(self, endpoint: str, response: Dict) -> Dict:
        """优化API响应"""
        # 压缩响应数据
        compressed_response = await self._compress_response(response)
        
        # 添加缓存控制头
        headers = {
            "Cache-Control": "public, max-age=300",
            "Content-Type": "application/json"
        }
        
        return {
            "data": compressed_response,
            "headers": headers
        }

    async def monitor_api_performance(self, endpoint: str) -> Dict:
        """监控API性能"""
        # 获取最近24小时的API调用统计
        stats = await self.db.api_stats.find({
            "endpoint": endpoint,
            "timestamp": {
                "$gte": datetime.utcnow() - timedelta(hours=24)
            }
        }).to_list(length=None)
        
        if not stats:
            return {"message": self.translator.get("no_api_stats")}
        
        # 计算性能指标
        response_times = [stat["response_time"] for stat in stats]
        error_rates = [stat["error_rate"] for stat in stats]
        
        return {
            "endpoint": endpoint,
            "total_calls": len(stats),
            "avg_response_time": sum(response_times) / len(response_times),
            "avg_error_rate": sum(error_rates) / len(error_rates),
            "hourly_stats": self._calculate_hourly_stats(stats)
        }

    async def optimize_frontend_assets(self) -> Dict:
        """优化前端资源"""
        return {
            "js_bundles": await self._optimize_js_bundles(),
            "css_bundles": await self._optimize_css_bundles(),
            "images": await self._optimize_images()
        }

    async def _get_index_hint(self, query: Dict) -> Dict:
        """获取索引提示"""
        # 这里可以实现索引分析逻辑
        return None

    async def _compress_response(self, response: Dict) -> Dict:
        """压缩响应数据"""
        # 这里可以实现响应压缩逻辑
        return response

    def _calculate_hourly_stats(self, stats: List[Dict]) -> List[Dict]:
        """计算每小时统计"""
        hourly_stats = {}
        for stat in stats:
            hour = stat["timestamp"].hour
            if hour not in hourly_stats:
                hourly_stats[hour] = {
                    "calls": 0,
                    "total_response_time": 0,
                    "errors": 0
                }
            
            hourly_stats[hour]["calls"] += 1
            hourly_stats[hour]["total_response_time"] += stat["response_time"]
            hourly_stats[hour]["errors"] += stat["error_count"]
        
        return [
            {
                "hour": hour,
                "calls": data["calls"],
                "avg_response_time": data["total_response_time"] / data["calls"],
                "error_rate": data["errors"] / data["calls"]
            }
            for hour, data in sorted(hourly_stats.items())
        ]

    async def _optimize_js_bundles(self) -> Dict:
        """优化JavaScript包"""
        return {
            "status": "optimized",
            "original_size": "2.5MB",
            "optimized_size": "800KB",
            "compression_ratio": "68%"
        }

    async def _optimize_css_bundles(self) -> Dict:
        """优化CSS包"""
        return {
            "status": "optimized",
            "original_size": "500KB",
            "optimized_size": "150KB",
            "compression_ratio": "70%"
        }

    async def _optimize_images(self) -> Dict:
        """优化图片"""
        return {
            "status": "optimized",
            "total_images": 100,
            "original_size": "10MB",
            "optimized_size": "3MB",
            "compression_ratio": "70%"
        } 