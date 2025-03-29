from typing import Dict, List, Optional
from datetime import datetime, timedelta
import csv
import io
import psutil
from ..database import get_database
from ..i18n import get_translator

class AdminService:
    def __init__(self, db, translator):
        self.db = db
        self.translator = translator

    async def get_all_users(self, page: int = 1, page_size: int = 20, search: str = None) -> Dict:
        """获取所有用户信息"""
        try:
            # 构建查询条件
            query = {}
            if search:
                query["$or"] = [
                    {"email": {"$regex": search, "$options": "i"}},
                    {"username": {"$regex": search, "$options": "i"}},
                    {"wallet_address": {"$regex": search, "$options": "i"}}
                ]

            # 计算总数
            total = await self.db.users.count_documents(query)

            # 获取分页数据
            users = await self.db.users.find(query).skip((page - 1) * page_size).limit(page_size).to_list(length=None)

            # 获取每个用户的详细信息
            user_details = []
            for user in users:
                # 获取邀请人信息
                referrer = None
                if user.get("referral_id"):
                    referrer = await self.db.users.find_one({"_id": user["referral_id"]})

                # 获取团队信息
                team = await self._get_team_info(user["_id"])

                # 获取交易统计
                trading_stats = await self._get_trading_stats(user["_id"])

                user_details.append({
                    "id": str(user["_id"]),
                    "email": user.get("email"),
                    "username": user.get("username"),
                    "wallet_address": user.get("wallet_address"),
                    "api_key": user.get("api_key"),
                    "api_secret": user.get("api_secret"),
                    "balance": user.get("balance", 0),
                    "gift_account_balance": user.get("gift_account_balance", 0),
                    "service_fee_balance": user.get("service_fee_balance", 0),
                    "registration_date": user.get("registration_date"),
                    "status": user.get("status", "active"),
                    "referrer": {
                        "id": str(referrer["_id"]) if referrer else None,
                        "email": referrer.get("email") if referrer else None,
                        "username": referrer.get("username") if referrer else None
                    } if referrer else None,
                    "team": team,
                    "trading_stats": trading_stats
                })

            return {
                "success": True,
                "data": {
                    "users": user_details,
                    "total": total,
                    "page": page,
                    "page_size": page_size,
                    "total_pages": (total + page_size - 1) // page_size
                }
            }
        except Exception as e:
            return {
                "success": False,
                "message": str(e)
            }

    async def get_user_details(self, user_id: str) -> Dict:
        """获取用户详细信息"""
        try:
            user = await self.db.users.find_one({"_id": user_id})
            if not user:
                return {
                    "success": False,
                    "message": self.translator.get("user_not_found")
                }

            # 获取邀请人信息
            referrer = None
            if user.get("referral_id"):
                referrer = await self.db.users.find_one({"_id": user["referral_id"]})

            # 获取团队信息
            team = await self._get_team_info(user_id)

            # 获取交易统计
            trading_stats = await self._get_trading_stats(user_id)

            # 获取费用历史
            fee_history = await self._get_fee_history(user_id)

            # 获取赠送账户历史
            gift_history = await self._get_gift_history(user_id)

            return {
                "success": True,
                "data": {
                    "basic_info": {
                        "id": str(user["_id"]),
                        "email": user.get("email"),
                        "username": user.get("username"),
                        "wallet_address": user.get("wallet_address"),
                        "api_key": user.get("api_key"),
                        "api_secret": user.get("api_secret"),
                        "registration_date": user.get("registration_date"),
                        "status": user.get("status", "active")
                    },
                    "balance_info": {
                        "balance": user.get("balance", 0),
                        "gift_account_balance": user.get("gift_account_balance", 0),
                        "service_fee_balance": user.get("service_fee_balance", 0)
                    },
                    "referrer": {
                        "id": str(referrer["_id"]) if referrer else None,
                        "email": referrer.get("email") if referrer else None,
                        "username": referrer.get("username") if referrer else None
                    } if referrer else None,
                    "team": team,
                    "trading_stats": trading_stats,
                    "fee_history": fee_history,
                    "gift_history": gift_history
                }
            }
        except Exception as e:
            return {
                "success": False,
                "message": str(e)
            }

    async def update_user_status(self, user_id: str, status: str) -> Dict:
        """更新用户状态"""
        try:
            result = await self.db.users.update_one(
                {"_id": user_id},
                {"$set": {"status": status}}
            )
            if result.modified_count:
                return {
                    "success": True,
                    "message": self.translator.get("user_status_updated")
                }
            return {
                "success": False,
                "message": self.translator.get("user_status_update_failed")
            }
        except Exception as e:
            return {
                "success": False,
                "message": str(e)
            }

    async def _get_team_info(self, user_id: str) -> Dict:
        """获取用户团队信息"""
        try:
            # 获取直接邀请的用户
            direct_referrals = await self.db.users.find({"referral_id": user_id}).to_list(length=None)
            
            # 获取第二代邀请的用户
            second_level_referrals = []
            for referral in direct_referrals:
                second_level = await self.db.users.find({"referral_id": referral["_id"]}).to_list(length=None)
                second_level_referrals.extend(second_level)

            return {
                "direct_referrals": len(direct_referrals),
                "second_level_referrals": len(second_level_referrals),
                "total_team_size": len(direct_referrals) + len(second_level_referrals)
            }
        except Exception:
            return {
                "direct_referrals": 0,
                "second_level_referrals": 0,
                "total_team_size": 0
            }

    async def _get_trading_stats(self, user_id: str) -> Dict:
        """获取用户交易统计"""
        try:
            # 获取最近30天的交易统计
            thirty_days_ago = datetime.now() - timedelta(days=30)
            trades = await self.db.trades.find({
                "user_id": user_id,
                "created_at": {"$gte": thirty_days_ago}
            }).to_list(length=None)

            total_trades = len(trades)
            winning_trades = len([t for t in trades if t.get("profit", 0) > 0])
            total_profit = sum(t.get("profit", 0) for t in trades)
            win_rate = (winning_trades / total_trades * 100) if total_trades > 0 else 0

            return {
                "total_trades": total_trades,
                "winning_trades": winning_trades,
                "total_profit": total_profit,
                "win_rate": win_rate,
                "period": "30天"
            }
        except Exception:
            return {
                "total_trades": 0,
                "winning_trades": 0,
                "total_profit": 0,
                "win_rate": 0,
                "period": "30天"
            }

    async def _get_fee_history(self, user_id: str) -> List[Dict]:
        """获取用户费用历史"""
        try:
            user = await self.db.users.find_one({"_id": user_id})
            if not user:
                return []
            return user.get("fee_transactions", [])
        except Exception:
            return []

    async def _get_gift_history(self, user_id: str) -> List[Dict]:
        """获取用户赠送账户历史"""
        try:
            user = await self.db.users.find_one({"_id": user_id})
            if not user:
                return []
            return user.get("gift_account_transactions", [])
        except Exception:
            return []

    async def export_users(self, filters: Dict = None) -> Dict:
        """导出用户数据"""
        try:
            # 构建查询条件
            query = self._build_filter_query(filters)
            
            # 获取所有用户数据
            users = await self.db.users.find(query).to_list(length=None)
            
            # 创建CSV文件
            output = io.StringIO()
            writer = csv.writer(output)
            
            # 写入表头
            headers = [
                "用户ID", "邮箱", "用户名", "钱包地址", "账户余额", "赠送余额", 
                "托管金额", "注册时间", "状态", "邀请人", "团队规模", 
                "总交易数", "盈利交易", "总盈利", "胜率"
            ]
            writer.writerow(headers)
            
            # 写入数据
            for user in users:
                # 获取邀请人信息
                referrer = None
                if user.get("referral_id"):
                    referrer = await self.db.users.find_one({"_id": user["referral_id"]})
                
                # 获取团队信息
                team = await self._get_team_info(user["_id"])
                
                # 获取交易统计
                trading_stats = await self._get_trading_stats(user["_id"])
                
                writer.writerow([
                    str(user["_id"]),
                    user.get("email", ""),
                    user.get("username", ""),
                    user.get("wallet_address", ""),
                    user.get("balance", 0),
                    user.get("gift_account_balance", 0),
                    user.get("service_fee_balance", 0),
                    user.get("registration_date", ""),
                    user.get("status", "active"),
                    referrer.get("username") if referrer else "",
                    team["total_team_size"],
                    trading_stats["total_trades"],
                    trading_stats["winning_trades"],
                    trading_stats["total_profit"],
                    f"{trading_stats['win_rate']:.2f}%"
                ])
            
            return {
                "success": True,
                "data": {
                    "csv_content": output.getvalue(),
                    "filename": f"users_export_{datetime.now().strftime('%Y%m%d_%H%M%S')}.csv"
                }
            }
        except Exception as e:
            return {
                "success": False,
                "message": str(e)
            }

    async def batch_update_status(self, user_ids: List[str], status: str) -> Dict:
        """批量更新用户状态"""
        try:
            result = await self.db.users.update_many(
                {"_id": {"$in": user_ids}},
                {"$set": {"status": status}}
            )
            return {
                "success": True,
                "data": {
                    "modified_count": result.modified_count
                }
            }
        except Exception as e:
            return {
                "success": False,
                "message": str(e)
            }

    async def get_user_operation_logs(self, user_id: str, page: int = 1, page_size: int = 20) -> Dict:
        """获取用户操作日志"""
        try:
            # 计算总数
            total = await self.db.operation_logs.count_documents({"user_id": user_id})
            
            # 获取分页数据
            logs = await self.db.operation_logs.find(
                {"user_id": user_id}
            ).sort("created_at", -1).skip((page - 1) * page_size).limit(page_size).to_list(length=None)
            
            return {
                "success": True,
                "data": {
                    "logs": logs,
                    "total": total,
                    "page": page,
                    "page_size": page_size,
                    "total_pages": (total + page_size - 1) // page_size
                }
            }
        except Exception as e:
            return {
                "success": False,
                "message": str(e)
            }

    async def get_platform_statistics(self) -> Dict:
        """获取平台统计数据"""
        try:
            # 获取总用户数
            total_users = await self.db.users.count_documents({})
            
            # 获取活跃用户数（最近30天有交易的用户）
            thirty_days_ago = datetime.now() - timedelta(days=30)
            active_users = await self.db.trades.distinct(
                "user_id",
                {"created_at": {"$gte": thirty_days_ago}}
            )
            active_users_count = len(active_users)
            
            # 获取总交易量
            total_trades = await self.db.trades.count_documents({})
            
            # 获取总交易金额
            total_volume = await self.db.trades.aggregate([
                {"$group": {"_id": None, "total": {"$sum": "$volume"}}}
            ]).to_list(length=None)
            total_volume = total_volume[0]["total"] if total_volume else 0
            
            # 获取总手续费
            total_fees = await self.db.trades.aggregate([
                {"$group": {"_id": None, "total": {"$sum": "$fee"}}}
            ]).to_list(length=None)
            total_fees = total_fees[0]["total"] if total_fees else 0
            
            return {
                "success": True,
                "data": {
                    "total_users": total_users,
                    "active_users": active_users_count,
                    "total_trades": total_trades,
                    "total_volume": total_volume,
                    "total_fees": total_fees,
                    "period": "30天"
                }
            }
        except Exception as e:
            return {
                "success": False,
                "message": str(e)
            }

    def _build_filter_query(self, filters: Dict = None) -> Dict:
        """构建查询条件"""
        query = {}
        if not filters:
            return query
            
        if filters.get("status"):
            query["status"] = filters["status"]
            
        if filters.get("min_balance"):
            query["balance"] = {"$gte": float(filters["min_balance"])}
            
        if filters.get("max_balance"):
            if "balance" not in query:
                query["balance"] = {}
            query["balance"]["$lte"] = float(filters["max_balance"])
            
        if filters.get("registration_date_start"):
            query["registration_date"] = {"$gte": filters["registration_date_start"]}
            
        if filters.get("registration_date_end"):
            if "registration_date" not in query:
                query["registration_date"] = {}
            query["registration_date"]["$lte"] = filters["registration_date_end"]
            
        if filters.get("has_trades"):
            query["has_trades"] = True
            
        if filters.get("team_size_min"):
            query["team_size"] = {"$gte": int(filters["team_size_min"])}
            
        if filters.get("team_size_max"):
            if "team_size" not in query:
                query["team_size"] = {}
            query["team_size"]["$lte"] = int(filters["team_size_max"])
            
        return query

    async def get_trend_statistics(self, period: str = "30d") -> Dict:
        """获取趋势统计数据"""
        try:
            # 计算时间范围
            end_date = datetime.now()
            if period == "7d":
                start_date = end_date - timedelta(days=7)
                interval = timedelta(days=1)
            elif period == "30d":
                start_date = end_date - timedelta(days=30)
                interval = timedelta(days=1)
            else:  # 90d
                start_date = end_date - timedelta(days=90)
                interval = timedelta(days=7)

            # 获取用户增长趋势
            user_growth = await self._get_user_growth(start_date, end_date, interval)
            
            # 获取交易量趋势
            trade_volume = await self._get_trade_volume(start_date, end_date, interval)
            
            # 获取盈亏趋势
            profit_trend = await self._get_profit_trend(start_date, end_date, interval)
            
            # 获取活跃用户趋势
            active_users = await self._get_active_users(start_date, end_date, interval)

            return {
                "success": True,
                "data": {
                    "user_growth": user_growth,
                    "trade_volume": trade_volume,
                    "profit_trend": profit_trend,
                    "active_users": active_users,
                    "period": period
                }
            }
        except Exception as e:
            return {
                "success": False,
                "message": str(e)
            }

    async def batch_delete_users(self, user_ids: List[str]) -> Dict:
        """批量删除用户"""
        try:
            # 检查是否有重要数据
            for user_id in user_ids:
                user = await self.db.users.find_one({"_id": user_id})
                if user.get("balance", 0) > 0 or user.get("gift_account_balance", 0) > 0:
                    return {
                        "success": False,
                        "message": "用户账户余额不为0，无法删除"
                    }

            result = await self.db.users.delete_many({"_id": {"$in": user_ids}})
            return {
                "success": True,
                "data": {
                    "deleted_count": result.deleted_count
                }
            }
        except Exception as e:
            return {
                "success": False,
                "message": str(e)
            }

    async def batch_reset_password(self, user_ids: List[str]) -> Dict:
        """批量重置密码"""
        try:
            # 生成随机密码
            import random
            import string
            new_passwords = {}
            for user_id in user_ids:
                password = ''.join(random.choices(string.ascii_letters + string.digits, k=12))
                hashed_password = self._hash_password(password)  # 实现密码哈希方法
                await self.db.users.update_one(
                    {"_id": user_id},
                    {"$set": {"password": hashed_password}}
                )
                new_passwords[str(user_id)] = password

            return {
                "success": True,
                "data": {
                    "new_passwords": new_passwords
                }
            }
        except Exception as e:
            return {
                "success": False,
                "message": str(e)
            }

    async def get_user_behavior_analysis(self, user_id: str) -> Dict:
        """获取用户行为分析"""
        try:
            # 获取最近30天的数据
            thirty_days_ago = datetime.now() - timedelta(days=30)
            
            # 获取交易行为
            trades = await self.db.trades.find({
                "user_id": user_id,
                "created_at": {"$gte": thirty_days_ago}
            }).to_list(length=None)
            
            # 获取登录行为
            logins = await self.db.login_logs.find({
                "user_id": user_id,
                "created_at": {"$gte": thirty_days_ago}
            }).to_list(length=None)
            
            # 获取操作行为
            operations = await self.db.operation_logs.find({
                "user_id": user_id,
                "created_at": {"$gte": thirty_days_ago}
            }).to_list(length=None)

            # 分析交易行为
            trading_behavior = self._analyze_trading_behavior(trades)
            
            # 分析登录行为
            login_behavior = self._analyze_login_behavior(logins)
            
            # 分析操作行为
            operation_behavior = self._analyze_operation_behavior(operations)

            return {
                "success": True,
                "data": {
                    "trading_behavior": trading_behavior,
                    "login_behavior": login_behavior,
                    "operation_behavior": operation_behavior,
                    "period": "30天"
                }
            }
        except Exception as e:
            return {
                "success": False,
                "message": str(e)
            }

    async def get_system_performance(self) -> Dict:
        """获取系统性能数据"""
        try:
            # CPU使用率
            cpu_percent = psutil.cpu_percent(interval=1)
            
            # 内存使用率
            memory = psutil.virtual_memory()
            memory_percent = memory.percent
            
            # 磁盘使用率
            disk = psutil.disk_usage('/')
            disk_percent = disk.percent
            
            # 网络IO
            net_io = psutil.net_io_counters()
            
            # 进程数
            process_count = len(psutil.pids())
            
            # 数据库连接数
            db_connections = await self.db.command("serverStatus")
            
            return {
                "success": True,
                "data": {
                    "cpu": {
                        "percent": cpu_percent,
                        "cores": psutil.cpu_count()
                    },
                    "memory": {
                        "total": memory.total,
                        "used": memory.used,
                        "percent": memory_percent
                    },
                    "disk": {
                        "total": disk.total,
                        "used": disk.used,
                        "percent": disk_percent
                    },
                    "network": {
                        "bytes_sent": net_io.bytes_sent,
                        "bytes_recv": net_io.bytes_recv
                    },
                    "processes": process_count,
                    "database": {
                        "connections": db_connections.get("connections", {}),
                        "uptime": db_connections.get("uptime", 0)
                    }
                }
            }
        except Exception as e:
            return {
                "success": False,
                "message": str(e)
            }

    async def _get_user_growth(self, start_date: datetime, end_date: datetime, interval: timedelta) -> List[Dict]:
        """获取用户增长趋势"""
        growth_data = []
        current_date = start_date
        while current_date <= end_date:
            count = await self.db.users.count_documents({
                "registration_date": {"$lte": current_date}
            })
            growth_data.append({
                "date": current_date.strftime("%Y-%m-%d"),
                "count": count
            })
            current_date += interval
        return growth_data

    async def _get_trade_volume(self, start_date: datetime, end_date: datetime, interval: timedelta) -> List[Dict]:
        """获取交易量趋势"""
        volume_data = []
        current_date = start_date
        while current_date <= end_date:
            next_date = current_date + interval
            trades = await self.db.trades.aggregate([
                {
                    "$match": {
                        "created_at": {
                            "$gte": current_date,
                            "$lt": next_date
                        }
                    }
                },
                {
                    "$group": {
                        "_id": None,
                        "count": {"$sum": 1},
                        "volume": {"$sum": "$volume"}
                    }
                }
            ]).to_list(length=None)
            
            volume_data.append({
                "date": current_date.strftime("%Y-%m-%d"),
                "count": trades[0]["count"] if trades else 0,
                "volume": trades[0]["volume"] if trades else 0
            })
            current_date += interval
        return volume_data

    async def _get_profit_trend(self, start_date: datetime, end_date: datetime, interval: timedelta) -> List[Dict]:
        """获取盈亏趋势"""
        profit_data = []
        current_date = start_date
        while current_date <= end_date:
            next_date = current_date + interval
            trades = await self.db.trades.aggregate([
                {
                    "$match": {
                        "created_at": {
                            "$gte": current_date,
                            "$lt": next_date
                        }
                    }
                },
                {
                    "$group": {
                        "_id": None,
                        "total_profit": {"$sum": "$profit"},
                        "winning_trades": {
                            "$sum": {"$cond": [{"$gt": ["$profit", 0]}, 1, 0]}
                        },
                        "total_trades": {"$sum": 1}
                    }
                }
            ]).to_list(length=None)
            
            profit_data.append({
                "date": current_date.strftime("%Y-%m-%d"),
                "total_profit": trades[0]["total_profit"] if trades else 0,
                "win_rate": (trades[0]["winning_trades"] / trades[0]["total_trades"] * 100) if trades and trades[0]["total_trades"] > 0 else 0
            })
            current_date += interval
        return profit_data

    async def _get_active_users(self, start_date: datetime, end_date: datetime, interval: timedelta) -> List[Dict]:
        """获取活跃用户趋势"""
        active_data = []
        current_date = start_date
        while current_date <= end_date:
            next_date = current_date + interval
            users = await self.db.trades.distinct(
                "user_id",
                {
                    "created_at": {
                        "$gte": current_date,
                        "$lt": next_date
                    }
                }
            )
            active_data.append({
                "date": current_date.strftime("%Y-%m-%d"),
                "count": len(users)
            })
            current_date += interval
        return active_data

    def _analyze_trading_behavior(self, trades: List[Dict]) -> Dict:
        """分析交易行为"""
        if not trades:
            return {
                "total_trades": 0,
                "win_rate": 0,
                "avg_profit": 0,
                "max_profit": 0,
                "max_loss": 0,
                "trading_frequency": 0,
                "preferred_time": None
            }

        winning_trades = [t for t in trades if t.get("profit", 0) > 0]
        losing_trades = [t for t in trades if t.get("profit", 0) < 0]
        
        # 计算交易时间分布
        trading_hours = [t["created_at"].hour for t in trades]
        preferred_hour = max(set(trading_hours), key=trading_hours.count) if trading_hours else None

        return {
            "total_trades": len(trades),
            "win_rate": len(winning_trades) / len(trades) * 100,
            "avg_profit": sum(t.get("profit", 0) for t in trades) / len(trades),
            "max_profit": max((t.get("profit", 0) for t in winning_trades), default=0),
            "max_loss": min((t.get("profit", 0) for t in losing_trades), default=0),
            "trading_frequency": len(trades) / 30,  # 每天平均交易次数
            "preferred_time": f"{preferred_hour:02d}:00" if preferred_hour is not None else None
        }

    def _analyze_login_behavior(self, logins: List[Dict]) -> Dict:
        """分析登录行为"""
        if not logins:
            return {
                "total_logins": 0,
                "unique_ips": 0,
                "login_frequency": 0,
                "preferred_time": None
            }

        login_hours = [l["created_at"].hour for l in logins]
        preferred_hour = max(set(login_hours), key=login_hours.count) if login_hours else None
        unique_ips = len(set(l.get("ip_address") for l in logins))

        return {
            "total_logins": len(logins),
            "unique_ips": unique_ips,
            "login_frequency": len(logins) / 30,  # 每天平均登录次数
            "preferred_time": f"{preferred_hour:02d}:00" if preferred_hour is not None else None
        }

    def _analyze_operation_behavior(self, operations: List[Dict]) -> Dict:
        """分析操作行为"""
        if not operations:
            return {
                "total_operations": 0,
                "operation_types": {},
                "operation_frequency": 0
            }

        # 统计操作类型
        operation_types = {}
        for op in operations:
            op_type = op.get("action")
            operation_types[op_type] = operation_types.get(op_type, 0) + 1

        return {
            "total_operations": len(operations),
            "operation_types": operation_types,
            "operation_frequency": len(operations) / 30  # 每天平均操作次数
        }

    def _hash_password(self, password: str) -> str:
        """密码哈希方法"""
        import hashlib
        return hashlib.sha256(password.encode()).hexdigest() 