import React from 'react';
import { motion } from 'framer-motion';
import PageTransition from '../components/PageTransition';
import PandaMascot from '../components/PandaMascot';
import { Line } from 'react-chartjs-2';

const DailyBrief: React.FC = () => {
  const marketSummary = {
    date: '2024-03-21',
    marketTrend: 'bullish',
    btcPrice: 65000,
    btcChange: 2.5,
    topGainers: [
      { symbol: 'ETH', change: 5.2 },
      { symbol: 'BNB', change: 3.8 },
      { symbol: 'SOL', change: 7.1 }
    ],
    marketSentiment: 75
  };

  const strategyPerformance = {
    totalPnL: 2500,
    winRate: 68,
    bestStrategy: '趋势跟踪',
    bestReturn: 12.5
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-panda-background dark:bg-gray-900 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl font-bold text-panda-primary dark:text-white mb-4">
              每日量化简报
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              {marketSummary.date}
            </p>
          </motion.div>

          {/* 市场概览 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
            >
              <h3 className="text-lg font-semibold mb-4">市场趋势</h3>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold text-panda-primary">
                    ${marketSummary.btcPrice.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-500">BTC/USDT</p>
                </div>
                <div className={`text-lg font-semibold ${
                  marketSummary.btcChange >= 0 ? 'text-panda-success' : 'text-panda-error'
                }`}>
                  {marketSummary.btcChange >= 0 ? '+' : ''}{marketSummary.btcChange}%
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
            >
              <h3 className="text-lg font-semibold mb-4">市场情绪</h3>
              <div className="relative pt-1">
                <div className="flex mb-2 items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-panda-primary bg-panda-primary bg-opacity-10">
                      {marketSummary.marketSentiment}% 看多
                    </span>
                  </div>
                </div>
                <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-panda-primary bg-opacity-10">
                  <div
                    style={{ width: `${marketSummary.marketSentiment}%` }}
                    className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-panda-primary"
                  ></div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
            >
              <h3 className="text-lg font-semibold mb-4">涨幅榜</h3>
              <div className="space-y-4">
                {marketSummary.topGainers.map((coin) => (
                  <div key={coin.symbol} className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-300">{coin.symbol}</span>
                    <span className="text-panda-success">+{coin.change}%</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* 策略表现 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg mb-8"
          >
            <h3 className="text-lg font-semibold mb-6">策略表现</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div>
                <p className="text-sm text-gray-500">总收益</p>
                <p className="text-2xl font-bold text-panda-success">
                  ${strategyPerformance.totalPnL.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">胜率</p>
                <p className="text-2xl font-bold text-panda-primary">
                  {strategyPerformance.winRate}%
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">最佳策略</p>
                <p className="text-2xl font-bold text-panda-primary">
                  {strategyPerformance.bestStrategy}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">最佳收益</p>
                <p className="text-2xl font-bold text-panda-success">
                  {strategyPerformance.bestReturn}%
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        <PandaMascot position="bottom" page="daily-brief" />
      </div>
    </PageTransition>
  );
};

export default DailyBrief; 