import React from 'react';
import { motion } from 'framer-motion';
import { Line } from 'react-chartjs-2';

const Dashboard: React.FC = () => {
  const platformStats = {
    totalUsers: 1500,
    activeUsers: 1200,
    totalTrades: 25000,
    totalVolume: 1500000,
    platformRevenue: 75000
  };

  const userGrowth = {
    labels: ['1月', '2月', '3月', '4月', '5月', '6月'],
    datasets: [
      {
        label: '用户增长',
        data: [800, 1000, 1200, 1400, 1500, 1500],
        borderColor: '#4CAF50',
        tension: 0.4
      }
    ]
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
            管理后台
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            平台运营数据概览
          </p>
        </motion.div>

        {/* 数据卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
          >
            <h3 className="text-lg font-semibold mb-4">用户统计</h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">总用户数</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {platformStats.totalUsers.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">活跃用户</p>
                <p className="text-2xl font-bold text-green-600">
                  {platformStats.activeUsers.toLocaleString()}
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
          >
            <h3 className="text-lg font-semibold mb-4">交易统计</h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">总交易数</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {platformStats.totalTrades.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">交易量</p>
                <p className="text-2xl font-bold text-blue-600">
                  ${platformStats.totalVolume.toLocaleString()}
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
          >
            <h3 className="text-lg font-semibold mb-4">平台收益</h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">本月收益</p>
                <p className="text-2xl font-bold text-purple-600">
                  ${platformStats.platformRevenue.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">同比增长</p>
                <p className="text-2xl font-bold text-green-600">
                  +25%
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* 图表区域 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
          >
            <h3 className="text-lg font-semibold mb-4">用户增长趋势</h3>
            <div className="h-80">
              <Line data={userGrowth} options={{ maintainAspectRatio: false }} />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
          >
            <h3 className="text-lg font-semibold mb-4">系统状态</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-300">CPU 使用率</span>
                <span className="text-green-600">45%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-300">内存使用率</span>
                <span className="text-green-600">60%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-300">磁盘使用率</span>
                <span className="text-yellow-600">75%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-300">网络延迟</span>
                <span className="text-green-600">50ms</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 