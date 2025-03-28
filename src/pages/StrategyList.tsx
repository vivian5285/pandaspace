import React, { useState } from 'react';
import { StrategyCard } from '../components/StrategyCard';
import { EmptyState } from '../components/EmptyState';

interface Strategy {
  id: string;
  name: string;
  isActive: boolean;
  returnRate: {
    daily: number;
    monthly: number;
    total: number;
  };
  description: string;
}

const strategies: Strategy[] = [
  {
    id: '1',
    name: '超级趋势过滤器',
    isActive: true,
    returnRate: {
      daily: 2.5,
      monthly: 15.8,
      total: 45.2,
    },
    description: '基于趋势指标和波动率过滤的中长期策略，适合震荡上升行情。',
  },
  {
    id: '2',
    name: '智能网格',
    isActive: false,
    returnRate: {
      daily: -0.8,
      monthly: 8.2,
      total: 28.5,
    },
    description: '自适应网格间距的网格交易策略，适合震荡行情。',
  },
];

export const StrategyList: React.FC = () => {
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleToggleStrategy = async (id: string) => {
    setLoadingId(id);
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1000));
      // 处理策略启用/停用逻辑
      console.log('Toggle strategy:', id);
    } finally {
      setLoadingId(null);
    }
  };

  const handleCreateStrategy = () => {
    // 处理创建策略的逻辑
    console.log('Create new strategy');
  };

  if (strategies.length === 0) {
    return (
      <EmptyState
        image="strategy"
        title="还没有创建策略"
        description="开启您的量化交易之旅，创建第一个交易策略吧！"
        actionText="立即创建策略"
        onAction={handleCreateStrategy}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      {strategies.map(strategy => (
        <StrategyCard
          key={strategy.id}
          {...strategy}
          loading={loadingId === strategy.id}
          onToggle={handleToggleStrategy}
        />
      ))}
    </div>
  );
}; 