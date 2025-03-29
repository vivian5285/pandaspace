import React, { useState } from 'react';
import { motion } from 'framer-motion';
import PageTransition from '../components/PageTransition';
import BrandAnimation from '../components/BrandAnimation';
import PandaMascot from '../components/PandaMascot';
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

const StrategyMarket: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: '全部策略' },
    { id: 'grid', name: '网格策略' },
    { id: 'trend', name: '趋势策略' },
    { id: 'dca', name: '定投策略' },
  ];

  const strategies = [
    {
      id: 1,
      name: '熊猫网格策略',
      category: 'grid',
      description: '基于价格区间的网格交易策略',
      performance: {
        daily: '+2.5%',
        weekly: '+8.3%',
        monthly: '+15.7%',
      },
      rating: 4.8,
      users: 1234,
      chartData: {
        labels: ['1月', '2月', '3月', '4月', '5月', '6月'],
        datasets: [
          {
            label: '收益曲线',
            data: [0, 2.5, 5.8, 8.3, 12.1, 15.7],
            borderColor: '#2ECC71',
            tension: 0.4,
          },
        ],
      },
    },
    // 更多策略数据...
  ];

  return (
    <PageTransition>
      <div className="min-h-screen bg-panda-background dark:bg-gray-900 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* 页面标题 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl font-bold text-panda-primary dark:text-white mb-4">
              策略市场
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              发现最适合您的交易策略
            </p>
          </motion.div>

          {/* 分类筛选 */}
          <div className="flex justify-center space-x-4 mb-8">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-6 py-2 rounded-full transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-panda-accent text-white'
                    : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>

          {/* 策略列表 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {strategies.map((strategy, index) => (
              <motion.div
                key={strategy.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
              >
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-panda-primary dark:text-white mb-2">
                    {strategy.name}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    {strategy.description}
                  </p>
                  
                  {/* 性能指标 */}
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="text-center">
                      <p className="text-sm text-gray-500 dark:text-gray-400">日收益</p>
                      <p className="text-lg font-semibold text-panda-success">
                        {strategy.performance.daily}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-500 dark:text-gray-400">周收益</p>
                      <p className="text-lg font-semibold text-panda-success">
                        {strategy.performance.weekly}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-500 dark:text-gray-400">月收益</p>
                      <p className="text-lg font-semibold text-panda-success">
                        {strategy.performance.monthly}
                      </p>
                    </div>
                  </div>

                  {/* 收益曲线 */}
                  <div className="h-32 mb-4">
                    <Line
                      data={strategy.chartData}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            display: false,
                          },
                        },
                        scales: {
                          y: {
                            display: false,
                          },
                          x: {
                            display: false,
                          },
                        },
                      }}
                    />
                  </div>

                  {/* 评分和用户数 */}
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <span className="text-yellow-400">★</span>
                      <span className="ml-1 text-gray-600 dark:text-gray-300">
                        {strategy.rating}
                      </span>
                    </div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {strategy.users} 用户
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <PandaMascot position="bottom" page="strategy-market" />
      </div>
    </PageTransition>
  );
};

export default StrategyMarket; 