from typing import List, Dict, Optional
from datetime import datetime, timedelta
import numpy as np
from ..models.user import User
from ..database import get_database
from ..i18n import get_translator

class StrategyService:
    def __init__(self, db, translator):
        self.db = db
        self.translator = translator

    async def analyze_trading_history(self, user_id: str) -> Dict:
        """分析用户交易历史"""
        trades = await self.db.trades.find({
            "user_id": user_id,
            "created_at": {
                "$gte": datetime.utcnow() - timedelta(days=30)
            }
        }).to_list(length=None)

        if not trades:
            return {"message": self.translator.get("no_trading_history")}

        # 计算关键指标
        profits = [trade["profit"] for trade in trades]
        win_rate = len([p for p in profits if p > 0]) / len(profits)
        avg_profit = np.mean(profits)
        max_drawdown = self._calculate_max_drawdown(profits)
        sharpe_ratio = self._calculate_sharpe_ratio(profits)

        return {
            "total_trades": len(trades),
            "win_rate": win_rate,
            "average_profit": avg_profit,
            "max_drawdown": max_drawdown,
            "sharpe_ratio": sharpe_ratio,
            "profit_distribution": self._analyze_profit_distribution(profits)
        }

    async def recommend_strategies(self, user_id: str) -> List[Dict]:
        """推荐交易策略"""
        analysis = await self.analyze_trading_history(user_id)
        user = await self.db.users.find_one({"_id": user_id})
        
        if not user:
            raise ValueError(self.translator.get("user_not_found"))

        # 基于用户特征和交易历史推荐策略
        recommendations = []
        
        # 根据风险承受能力推荐
        risk_level = user.get("risk_level", "medium")
        if risk_level == "low":
            recommendations.extend(self._get_low_risk_strategies())
        elif risk_level == "high":
            recommendations.extend(self._get_high_risk_strategies())
        else:
            recommendations.extend(self._get_medium_risk_strategies())

        # 根据交易历史调整推荐
        if analysis["win_rate"] < 0.4:
            recommendations.extend(self._get_risk_management_strategies())
        if analysis["max_drawdown"] > 0.2:
            recommendations.extend(self._get_drawdown_control_strategies())

        return recommendations

    async def generate_performance_report(self, user_id: str, period: str = "month") -> Dict:
        """生成性能报告"""
        end_date = datetime.utcnow()
        if period == "month":
            start_date = end_date - timedelta(days=30)
        elif period == "week":
            start_date = end_date - timedelta(days=7)
        else:
            start_date = end_date - timedelta(days=1)

        trades = await self.db.trades.find({
            "user_id": user_id,
            "created_at": {
                "$gte": start_date,
                "$lte": end_date
            }
        }).to_list(length=None)

        if not trades:
            return {"message": self.translator.get("no_trading_history")}

        # 计算性能指标
        profits = [trade["profit"] for trade in trades]
        total_profit = sum(profits)
        win_rate = len([p for p in profits if p > 0]) / len(profits)
        max_drawdown = self._calculate_max_drawdown(profits)
        sharpe_ratio = self._calculate_sharpe_ratio(profits)

        # 按策略分组统计
        strategy_stats = self._analyze_strategy_performance(trades)

        return {
            "period": period,
            "start_date": start_date,
            "end_date": end_date,
            "total_trades": len(trades),
            "total_profit": total_profit,
            "win_rate": win_rate,
            "max_drawdown": max_drawdown,
            "sharpe_ratio": sharpe_ratio,
            "strategy_stats": strategy_stats,
            "daily_profits": self._calculate_daily_profits(trades)
        }

    def _calculate_max_drawdown(self, profits: List[float]) -> float:
        """计算最大回撤"""
        cumulative = np.cumsum(profits)
        running_max = np.maximum.accumulate(cumulative)
        drawdown = (running_max - cumulative) / running_max
        return float(np.max(drawdown))

    def _calculate_sharpe_ratio(self, profits: List[float]) -> float:
        """计算夏普比率"""
        if not profits:
            return 0
        returns = np.array(profits)
        return float(np.mean(returns) / np.std(returns) if np.std(returns) != 0 else 0)

    def _analyze_profit_distribution(self, profits: List[float]) -> Dict:
        """分析利润分布"""
        return {
            "mean": float(np.mean(profits)),
            "median": float(np.median(profits)),
            "std": float(np.std(profits)),
            "skew": float(np.skew(profits)),
            "kurtosis": float(np.kurtosis(profits))
        }

    def _analyze_strategy_performance(self, trades: List[Dict]) -> Dict:
        """分析策略表现"""
        strategy_stats = {}
        for trade in trades:
            strategy = trade.get("strategy", "unknown")
            if strategy not in strategy_stats:
                strategy_stats[strategy] = {
                    "total_trades": 0,
                    "winning_trades": 0,
                    "total_profit": 0,
                    "avg_profit": 0
                }
            
            stats = strategy_stats[strategy]
            stats["total_trades"] += 1
            if trade["profit"] > 0:
                stats["winning_trades"] += 1
            stats["total_profit"] += trade["profit"]
            stats["avg_profit"] = stats["total_profit"] / stats["total_trades"]

        return strategy_stats

    def _calculate_daily_profits(self, trades: List[Dict]) -> List[Dict]:
        """计算每日收益"""
        daily_profits = {}
        for trade in trades:
            date = trade["created_at"].date()
            if date not in daily_profits:
                daily_profits[date] = 0
            daily_profits[date] += trade["profit"]

        return [
            {"date": date, "profit": profit}
            for date, profit in sorted(daily_profits.items())
        ]

    def _get_low_risk_strategies(self) -> List[Dict]:
        """获取低风险策略"""
        return [
            {
                "name": "grid_trading",
                "description": self.translator.get("grid_trading_description"),
                "risk_level": "low",
                "expected_return": "5-10%",
                "recommendation_reason": self.translator.get("grid_trading_reason")
            },
            {
                "name": "dca_strategy",
                "description": self.translator.get("dca_strategy_description"),
                "risk_level": "low",
                "expected_return": "3-8%",
                "recommendation_reason": self.translator.get("dca_strategy_reason")
            }
        ]

    def _get_medium_risk_strategies(self) -> List[Dict]:
        """获取中等风险策略"""
        return [
            {
                "name": "trend_following",
                "description": self.translator.get("trend_following_description"),
                "risk_level": "medium",
                "expected_return": "10-20%",
                "recommendation_reason": self.translator.get("trend_following_reason")
            },
            {
                "name": "mean_reversion",
                "description": self.translator.get("mean_reversion_description"),
                "risk_level": "medium",
                "expected_return": "8-15%",
                "recommendation_reason": self.translator.get("mean_reversion_reason")
            }
        ]

    def _get_high_risk_strategies(self) -> List[Dict]:
        """获取高风险策略"""
        return [
            {
                "name": "leverage_trading",
                "description": self.translator.get("leverage_trading_description"),
                "risk_level": "high",
                "expected_return": "20-50%",
                "recommendation_reason": self.translator.get("leverage_trading_reason")
            },
            {
                "name": "arbitrage",
                "description": self.translator.get("arbitrage_description"),
                "risk_level": "high",
                "expected_return": "15-40%",
                "recommendation_reason": self.translator.get("arbitrage_reason")
            }
        ]

    def _get_risk_management_strategies(self) -> List[Dict]:
        """获取风险管理策略"""
        return [
            {
                "name": "stop_loss",
                "description": self.translator.get("stop_loss_description"),
                "risk_level": "medium",
                "expected_return": "N/A",
                "recommendation_reason": self.translator.get("stop_loss_reason")
            }
        ]

    def _get_drawdown_control_strategies(self) -> List[Dict]:
        """获取回撤控制策略"""
        return [
            {
                "name": "position_sizing",
                "description": self.translator.get("position_sizing_description"),
                "risk_level": "medium",
                "expected_return": "N/A",
                "recommendation_reason": self.translator.get("position_sizing_reason")
            }
        ] 