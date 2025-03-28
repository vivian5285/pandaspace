import React, { useEffect, useState } from 'react';
import { EarningsCard } from '../components/EarningsCard';
import { StrategyCard } from '../components/StrategyCard';
import { fetchEarningsSummary, fetchStrategies, toggleStrategy } from '../api/dashboard';
import type { EarningsSummary, Strategy } from '../types/dashboard';

export default function Dashboard() {
  const [earnings, setEarnings] = useState<EarningsSummary | null>(null);
  const [strategies, setStrategies] = useState<Strategy[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const [earningsData, strategiesData] = await Promise.all([
          fetchEarningsSummary(),
          fetchStrategies()
        ]);
        setEarnings(earningsData);
        setStrategies(strategiesData);
      } catch (error) {
        console.error('Failed to load dashboard:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  const handleStrategyToggle = async (strategyId: string, newStatus: boolean) => {
    try {
      await toggleStrategy(strategyId, newStatus);
      setStrategies(strategies.map(strategy => 
        strategy.id === strategyId 
          ? { ...strategy, status: newStatus ? 'active' : 'inactive' }
          : strategy
      ));
    } catch (error) {
      console.error('Failed to toggle strategy:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* 收益概览区域 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <EarningsCard
          title="今日收益"
          amount={earnings?.todayEarnings ?? 0}
          trend={1.2}
        />
        <EarningsCard
          title="本月收益"
          amount={earnings?.monthEarnings ?? 0}
          trend={2.5}
        />
        <EarningsCard
          title="总收益"
          amount={earnings?.totalEarnings ?? 0}
          trend={15.7}
        />
      </div>

      {/* 策略列表区域 */}
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">策略管理</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {strategies.map((strategy) => (
          <StrategyCard
            key={strategy.id}
            strategy={strategy}
            onToggle={(enabled) => handleStrategyToggle(strategy.id, enabled)}
          />
        ))}
      </div>
    </div>
  );
} 