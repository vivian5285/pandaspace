import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface Strategy {
  id: string;
  name: string;
  description: string;
  type: 'superTrend' | 'grid' | 'scalping' | 'sentiment';
  riskLevel: 'low' | 'medium' | 'high';
  minMonthlyReturn: number;
  maxMonthlyReturn: number;
  parameters: Record<string, any>;
  status: 'active' | 'inactive';
}

interface ProfitGuarantee {
  userId: string;
  strategyId: string;
  minMonthlyReturn: number;
  maxMonthlyReturn: number;
  currentReturn: number;
  startDate: string;
  endDate: string;
}

const StrategyConfig: React.FC = () => {
  const [strategies, setStrategies] = useState<Strategy[]>([
    {
      id: '1',
      name: '超级趋势策略',
      description: '基于价格波动和移动平均线的趋势跟踪策略',
      type: 'superTrend',
      riskLevel: 'medium',
      minMonthlyReturn: 50,
      maxMonthlyReturn: 150,
      parameters: {
        atrPeriod: 14,
        multiplier: 3,
        maPeriod: 20,
      },
      status: 'active',
    },
    {
      id: '2',
      name: '智能网格策略',
      description: '在固定价格区间内进行多次小幅交易的策略',
      type: 'grid',
      riskLevel: 'low',
      minMonthlyReturn: 30,
      maxMonthlyReturn: 100,
      parameters: {
        gridCount: 10,
        gridSpacing: 0.02,
        positionSize: 0.1,
      },
      status: 'active',
    },
  ]);

  const [profitGuarantees, setProfitGuarantees] = useState<ProfitGuarantee[]>([
    {
      userId: 'user1',
      strategyId: '1',
      minMonthlyReturn: 50,
      maxMonthlyReturn: 150,
      currentReturn: 75,
      startDate: '2024-01-01',
      endDate: '2024-12-31',
    },
  ]);

  const [selectedStrategy, setSelectedStrategy] = useState<Strategy | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isNewStrategyModalOpen, setIsNewStrategyModalOpen] = useState(false);

  // 模拟历史收益数据
  const historicalData = {
    labels: ['1月', '2月', '3月', '4月', '5月', '6月'],
    datasets: [
      {
        label: '实际收益',
        data: [65, 85, 120, 95, 140, 110],
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      },
      {
        label: '目标收益',
        data: [50, 50, 50, 50, 50, 50],
        borderColor: 'rgb(255, 99, 132)',
        borderDash: [5, 5],
        tension: 0.1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: '策略收益趋势',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: '收益率 (%)',
        },
      },
    },
  };

  const handleEditStrategy = (strategy: Strategy) => {
    setSelectedStrategy(strategy);
    setIsEditModalOpen(true);
  };

  const handleSaveStrategy = (updatedStrategy: Strategy) => {
    setStrategies(strategies.map(strategy =>
      strategy.id === updatedStrategy.id ? updatedStrategy : strategy
    ));
    setIsEditModalOpen(false);
  };

  const handleCreateStrategy = (newStrategy: Omit<Strategy, 'id'>) => {
    const strategy: Strategy = {
      ...newStrategy,
      id: Date.now().toString(),
    };
    setStrategies([...strategies, strategy]);
    setIsNewStrategyModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            策略配置
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            管理交易策略和收益保障
          </p>
        </motion.div>

        {/* 策略列表 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {strategies.map((strategy) => (
            <motion.div
              key={strategy.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {strategy.name}
                </h3>
                <span
                  className={`px-2 py-1 rounded-full text-xs ${
                    strategy.status === 'active'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {strategy.status === 'active' ? '运行中' : '已停用'}
                </span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                {strategy.description}
              </p>
              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">风险等级</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {strategy.riskLevel === 'low' ? '低' : strategy.riskLevel === 'medium' ? '中' : '高'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">月化收益范围</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {strategy.minMonthlyReturn}% - {strategy.maxMonthlyReturn}%
                  </span>
                </div>
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => handleEditStrategy(strategy)}
                  className="text-panda-accent hover:text-panda-accent-dark"
                >
                  编辑
                </button>
                <button
                  onClick={() => {
                    setStrategies(strategies.map(s =>
                      s.id === strategy.id
                        ? { ...s, status: s.status === 'active' ? 'inactive' : 'active' }
                        : s
                    ));
                  }}
                  className="text-red-500 hover:text-red-700"
                >
                  {strategy.status === 'active' ? '停用' : '启用'}
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* 收益趋势图 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8"
        >
          <Line options={chartOptions} data={historicalData} />
        </motion.div>

        {/* 新增策略按钮 */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setIsNewStrategyModalOpen(true)}
          className="fixed bottom-8 right-8 bg-panda-accent text-white p-4 rounded-full shadow-lg hover:bg-opacity-90"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
        </motion.button>

        {/* 编辑策略模态框 */}
        {isEditModalOpen && selectedStrategy && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full mx-4">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                编辑策略
              </h3>
              <form onSubmit={(e) => {
                e.preventDefault();
                handleSaveStrategy(selectedStrategy);
              }}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    策略名称
                  </label>
                  <input
                    type="text"
                    value={selectedStrategy.name}
                    onChange={(e) =>
                      setSelectedStrategy({ ...selectedStrategy, name: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-panda-accent focus:border-panda-accent"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    策略描述
                  </label>
                  <textarea
                    value={selectedStrategy.description}
                    onChange={(e) =>
                      setSelectedStrategy({ ...selectedStrategy, description: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-panda-accent focus:border-panda-accent"
                    rows={3}
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    风险等级
                  </label>
                  <select
                    value={selectedStrategy.riskLevel}
                    onChange={(e) =>
                      setSelectedStrategy({
                        ...selectedStrategy,
                        riskLevel: e.target.value as 'low' | 'medium' | 'high',
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-panda-accent focus:border-panda-accent"
                  >
                    <option value="low">低风险</option>
                    <option value="medium">中等风险</option>
                    <option value="high">高风险</option>
                  </select>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    最小月化收益 (%)
                  </label>
                  <input
                    type="number"
                    value={selectedStrategy.minMonthlyReturn}
                    onChange={(e) =>
                      setSelectedStrategy({
                        ...selectedStrategy,
                        minMonthlyReturn: Number(e.target.value),
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-panda-accent focus:border-panda-accent"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    最大月化收益 (%)
                  </label>
                  <input
                    type="number"
                    value={selectedStrategy.maxMonthlyReturn}
                    onChange={(e) =>
                      setSelectedStrategy({
                        ...selectedStrategy,
                        maxMonthlyReturn: Number(e.target.value),
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-panda-accent focus:border-panda-accent"
                    required
                  />
                </div>
                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => setIsEditModalOpen(false)}
                    className="px-4 py-2 text-gray-700 hover:text-gray-900"
                  >
                    取消
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-panda-accent text-white rounded-lg hover:bg-opacity-90"
                  >
                    保存
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* 新增策略模态框 */}
        {isNewStrategyModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full mx-4">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                新增策略
              </h3>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  const newStrategy: Omit<Strategy, 'id'> = {
                    name: formData.get('name') as string,
                    description: formData.get('description') as string,
                    type: formData.get('type') as Strategy['type'],
                    riskLevel: formData.get('riskLevel') as Strategy['riskLevel'],
                    minMonthlyReturn: Number(formData.get('minMonthlyReturn')),
                    maxMonthlyReturn: Number(formData.get('maxMonthlyReturn')),
                    parameters: {},
                    status: 'active',
                  };
                  handleCreateStrategy(newStrategy);
                }}
              >
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    策略名称
                  </label>
                  <input
                    type="text"
                    name="name"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-panda-accent focus:border-panda-accent"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    策略描述
                  </label>
                  <textarea
                    name="description"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-panda-accent focus:border-panda-accent"
                    rows={3}
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    策略类型
                  </label>
                  <select
                    name="type"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-panda-accent focus:border-panda-accent"
                    required
                  >
                    <option value="superTrend">超级趋势策略</option>
                    <option value="grid">智能网格策略</option>
                    <option value="scalping">剥头皮策略</option>
                    <option value="sentiment">市场情绪策略</option>
                  </select>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    风险等级
                  </label>
                  <select
                    name="riskLevel"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-panda-accent focus:border-panda-accent"
                    required
                  >
                    <option value="low">低风险</option>
                    <option value="medium">中等风险</option>
                    <option value="high">高风险</option>
                  </select>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    最小月化收益 (%)
                  </label>
                  <input
                    type="number"
                    name="minMonthlyReturn"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-panda-accent focus:border-panda-accent"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    最大月化收益 (%)
                  </label>
                  <input
                    type="number"
                    name="maxMonthlyReturn"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-panda-accent focus:border-panda-accent"
                    required
                  />
                </div>
                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => setIsNewStrategyModalOpen(false)}
                    className="px-4 py-2 text-gray-700 hover:text-gray-900"
                  >
                    取消
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-panda-accent text-white rounded-lg hover:bg-opacity-90"
                  >
                    创建
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StrategyConfig; 