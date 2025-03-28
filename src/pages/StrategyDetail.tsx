import React from 'react';
import { PerformanceChart } from '../components/PerformanceChart';
import { StrategyParams } from '../components/StrategyParams';
import { StrategyInfo } from '../components/StrategyInfo';

interface StrategyData {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  params: {
    stopLoss: number;
    takeProfit: number;
    leverage: number;
    interval: string;
  };
}

const strategyData: StrategyData = {
  id: '1',
  name: '超级趋势过滤器',
  description: '基于趋势指标和波动率过滤的中长期策略，适合震荡上升行情。',
  isActive: true,
  params: {
    stopLoss: 2.5,
    takeProfit: 5.0,
    leverage: 3,
    interval: '4h'
  }
};

export const StrategyDetail: React.FC = () => {
  const handleToggleStrategy = () => {
    // 处理策略启用/停用逻辑
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">{strategyData.name}</h1>
          <p className="mt-2 text-gray-600">{strategyData.description}</p>
        </div>

        {/* 图表区域 */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">收益表现</h2>
          <div className="h-[400px]">
            <PerformanceChart />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 参数信息 */}
          <div className="lg:col-span-2">
            <StrategyParams params={strategyData.params} />
          </div>

          {/* 策略信息和操作按钮 */}
          <div className="lg:col-span-1">
            <StrategyInfo 
              isActive={strategyData.isActive} 
              onToggle={handleToggleStrategy} 
            />
          </div>
        </div>
      </div>
    </div>
  );
}; 