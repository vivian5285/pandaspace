import React, { useState } from 'react';
import { motion } from 'framer-motion';
import PageTransition from '../components/PageTransition';
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

interface Position {
  symbol: string;
  quantity: number;
  entryPrice: number;
  currentPrice: number;
  pnl: number;
  pnlPercentage: number;
}

const TradingCenter: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'positions' | 'orders' | 'history'>('positions');

  const positions: Position[] = [
    {
      symbol: 'BTC/USDT',
      quantity: 0.5,
      entryPrice: 45000,
      currentPrice: 47000,
      pnl: 1000,
      pnlPercentage: 4.44
    },
    // 更多持仓数据...
  ];

  const accountSummary = {
    totalEquity: 50000,
    availableBalance: 30000,
    margin: 20000,
    todayPnL: 1500,
    weeklyPnL: 5000
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-panda-background dark:bg-gray-900 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* 账户概览 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
          >
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
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
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
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
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
              <h3 className="text-lg font-semibold mb-4">策略运行状态</h3>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <p className="text-sm">正常运行中</p>
              </div>
              <div className="mt-4">
                <p className="text-sm text-gray-500">运行时长</p>
                <p className="text-lg font-semibold">7天 12小时</p>
              </div>
            </div>
          </motion.div>

          {/* 标签页切换 */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
            <div className="border-b border-gray-200 dark:border-gray-700">
              <nav className="flex">
                {['positions', 'orders', 'history'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab as typeof activeTab)}
                    className={`px-6 py-4 text-sm font-medium ${
                      activeTab === tab
                        ? 'border-b-2 border-panda-accent text-panda-accent'
                        : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    {tab === 'positions' && '当前持仓'}
                    {tab === 'orders' && '委托订单'}
                    {tab === 'history' && '历史记录'}
                  </button>
                ))}
              </nav>
            </div>

            <div className="p-6">
              {activeTab === 'positions' && (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead>
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          交易对
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          持仓数量
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          开仓均价
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          当前价格
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          未实现盈亏
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                      {positions.map((position) => (
                        <tr key={position.symbol}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {position.symbol}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">
                              {position.quantity}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">
                              ${position.entryPrice.toLocaleString()}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">
                              ${position.currentPrice.toLocaleString()}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className={`text-sm font-semibold ${
                              position.pnl >= 0 ? 'text-panda-success' : 'text-panda-error'
                            }`}>
                              ${position.pnl.toLocaleString()} ({position.pnlPercentage}%)
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>

        <PandaMascot position="bottom" page="trading" />
      </div>
    </PageTransition>
  );
};

export default TradingCenter; 