import React from 'react';
import { motion } from 'framer-motion';
import PageTransition from '../components/PageTransition';
import PandaMascot from '../components/PandaMascot';
import TradingChart from '../components/charts/TradingChart';

const Home: React.FC = () => {
  const accountSummary = {
    totalEquity: 50000,
    availableBalance: 30000,
    margin: 20000,
    todayPnL: 1500,
    weeklyPnL: 5000
  };

  const recentTrades = [
    { id: 1, symbol: 'BTC/USDT', type: 'buy', amount: 0.5, price: 45000, time: '2024-03-21 10:30' },
    { id: 2, symbol: 'ETH/USDT', type: 'sell', amount: 2, price: 2500, time: '2024-03-21 09:15' },
    { id: 3, symbol: 'BNB/USDT', type: 'buy', amount: 5, price: 350, time: '2024-03-21 08:45' }
  ];

  return (
    <PageTransition>
      <div className="min-h-screen bg-panda-background dark:bg-gray-900 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* 欢迎区域 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl font-bold text-panda-primary dark:text-white mb-4">
              欢迎回来，交易者！
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              今天继续发大财！
            </p>
          </motion.div>

          {/* 账户概览 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
            >
              <h3 className="text-lg font-semibold mb-4">账户权益</h3>
              <p className="text-3xl font-bold text-panda-primary">
                ${accountSummary.totalEquity.toLocaleString()}
              </p>
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">可用余额</p>
                  <p className="text-lg font-semibold">
                    ${accountSummary.availableBalance.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">保证金</p>
                  <p className="text-lg font-semibold">
                    ${accountSummary.margin.toLocaleString()}
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
              <h3 className="text-lg font-semibold mb-4">今日盈亏</h3>
              <p className={`text-3xl font-bold ${accountSummary.todayPnL >= 0 ? 'text-panda-success' : 'text-panda-error'}`}>
                ${accountSummary.todayPnL.toLocaleString()}
              </p>
              <div className="mt-4">
                <p className="text-sm text-gray-500">本周盈亏</p>
                <p className={`text-lg font-semibold ${accountSummary.weeklyPnL >= 0 ? 'text-panda-success' : 'text-panda-error'}`}>
                  ${accountSummary.weeklyPnL.toLocaleString()}
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
            >
              <h3 className="text-lg font-semibold mb-4">策略运行状态</h3>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <p className="text-sm">正常运行中</p>
              </div>
              <div className="mt-4">
                <p className="text-sm text-gray-500">运行时长</p>
                <p className="text-lg font-semibold">7天 12小时</p>
              </div>
            </motion.div>
          </div>

          {/* 最近交易 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8"
          >
            <h3 className="text-lg font-semibold mb-4">最近交易</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      交易对
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      类型
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      数量
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      价格
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      时间
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {recentTrades.map((trade) => (
                    <tr key={trade.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {trade.symbol}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          trade.type === 'buy'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {trade.type === 'buy' ? '买入' : '卖出'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {trade.amount}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          ${trade.price.toLocaleString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {trade.time}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>

        <PandaMascot position="bottom" page="dashboard" />
      </div>
    </PageTransition>
  );
};

export default Home; 