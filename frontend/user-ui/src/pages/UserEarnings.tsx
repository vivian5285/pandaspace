import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { toast } from 'react-hot-toast';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface TradingProfit {
  date: string;
  profit: number;
  type: 'long' | 'short';
}

interface MonthlyReturn {
  month: string;
  return: number;
  target: number;
}

interface ReferralEarning {
  userId: string;
  name: string;
  earnings: number;
  date: string;
}

interface EarningsReport {
  totalProfit: number;
  monthlyReturn: number;
  referralEarnings: number;
  tradingProfits: TradingProfit[];
  monthlyReturns: MonthlyReturn[];
  referralEarningsList: ReferralEarning[];
  prediction: {
    nextMonth: number;
    nextQuarter: number;
    nextYear: number;
  };
}

const UserEarnings: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('month');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [report, setReport] = useState<EarningsReport | null>(null);
  const [exportFormat, setExportFormat] = useState<'csv' | 'excel'>('csv');

  // 获取收益数据
  const fetchEarningsData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch(`/api/earnings?timeRange=${timeRange}`);
      if (!response.ok) {
        throw new Error('Failed to fetch earnings data');
      }
      const data = await response.json();
      setReport(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : '获取数据失败');
      toast.error('获取数据失败，请稍后重试');
    } finally {
      setIsLoading(false);
    }
  };

  // 导出收益数据
  const handleExport = async () => {
    try {
      const response = await fetch(`/api/earnings/export?format=${exportFormat}`);
      if (!response.ok) {
        throw new Error('Failed to export earnings data');
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `earnings-report.${exportFormat}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success('导出成功');
    } catch (err) {
      toast.error('导出失败，请稍后重试');
    }
  };

  // 初始加载和刷新数据
  useEffect(() => {
    fetchEarningsData();
  }, [timeRange]);

  // 自动刷新数据（每5分钟）
  useEffect(() => {
    const interval = setInterval(fetchEarningsData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-red-50 dark:bg-red-900 p-4 rounded-lg">
            <p className="text-red-700 dark:text-red-200">{error}</p>
            <button
              onClick={fetchEarningsData}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              重试
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-panda-accent"></div>
          </div>
        </div>
      </div>
    );
  }

  // 交易收益图表数据
  const tradingProfitData = {
    labels: report.tradingProfits.map(trade => trade.date),
    datasets: [
      {
        label: '交易收益',
        data: report.tradingProfits.map(trade => trade.profit),
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      },
    ],
  };

  // 月化收益图表数据
  const monthlyReturnData = {
    labels: report.monthlyReturns.map(m => m.month),
    datasets: [
      {
        label: '实际收益',
        data: report.monthlyReturns.map(m => m.return),
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
      },
      {
        label: '目标收益',
        data: report.monthlyReturns.map(m => m.target),
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
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
        text: '收益趋势',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: '金额 (元)',
        },
      },
    },
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
            收益中心
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            查看您的交易收益和月化收益
          </p>
        </motion.div>

        {/* 收益概览 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              总收益
            </h3>
            <p className="text-3xl font-bold text-panda-accent">
              ¥{report.totalProfit.toFixed(2)}
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              月化收益
            </h3>
            <p className="text-3xl font-bold text-panda-accent">
              {report.monthlyReturn.toFixed(2)}%
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              推荐收益
            </h3>
            <p className="text-3xl font-bold text-panda-accent">
              ¥{report.referralEarnings.toFixed(2)}
            </p>
          </motion.div>
        </div>

        {/* 操作栏 */}
        <div className="flex justify-between items-center mb-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-1">
            <button
              onClick={() => setTimeRange('week')}
              className={`px-4 py-2 rounded-md ${
                timeRange === 'week'
                  ? 'bg-panda-accent text-white'
                  : 'text-gray-700 dark:text-gray-300'
              }`}
            >
              周
            </button>
            <button
              onClick={() => setTimeRange('month')}
              className={`px-4 py-2 rounded-md ${
                timeRange === 'month'
                  ? 'bg-panda-accent text-white'
                  : 'text-gray-700 dark:text-gray-300'
              }`}
            >
              月
            </button>
            <button
              onClick={() => setTimeRange('year')}
              className={`px-4 py-2 rounded-md ${
                timeRange === 'year'
                  ? 'bg-panda-accent text-white'
                  : 'text-gray-700 dark:text-gray-300'
              }`}
            >
              年
            </button>
          </div>
          <div className="flex items-center space-x-4">
            <select
              value={exportFormat}
              onChange={(e) => setExportFormat(e.target.value as 'csv' | 'excel')}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-panda-accent focus:border-panda-accent"
            >
              <option value="csv">CSV</option>
              <option value="excel">Excel</option>
            </select>
            <button
              onClick={handleExport}
              className="px-4 py-2 bg-panda-accent text-white rounded-lg hover:bg-opacity-90"
            >
              导出数据
            </button>
            <button
              onClick={fetchEarningsData}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-opacity-90"
            >
              刷新
            </button>
          </div>
        </div>

        {/* 交易收益图表 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            交易收益趋势
          </h3>
          <Line options={chartOptions} data={tradingProfitData} />
        </motion.div>

        {/* 月化收益图表 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            月化收益对比
          </h3>
          <Bar
            options={{
              ...chartOptions,
              scales: {
                y: {
                  beginAtZero: true,
                  title: {
                    display: true,
                    text: '收益率 (%)',
                  },
                },
              },
            }}
            data={monthlyReturnData}
          />
        </motion.div>

        {/* 收益预测 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            收益预测
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400">下月预测</p>
              <p className="text-2xl font-bold text-panda-accent">
                {report.prediction.nextMonth.toFixed(2)}%
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400">下季度预测</p>
              <p className="text-2xl font-bold text-panda-accent">
                {report.prediction.nextQuarter.toFixed(2)}%
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400">下年预测</p>
              <p className="text-2xl font-bold text-panda-accent">
                {report.prediction.nextYear.toFixed(2)}%
              </p>
            </div>
          </div>
        </motion.div>

        {/* 推荐收益列表 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            推荐收益明细
          </h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    用户
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    收益
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    日期
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {report.referralEarningsList.map((earning) => (
                  <tr key={earning.userId}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {earning.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-panda-accent">
                      ¥{earning.earnings.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {new Date(earning.date).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default UserEarnings;