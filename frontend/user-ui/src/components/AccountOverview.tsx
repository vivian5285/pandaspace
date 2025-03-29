import React from 'react';
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

const AccountOverview: React.FC = () => {
  const chartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Account Balance',
        data: [10000, 12000, 11500, 13000, 12500, 14000],
        borderColor: 'rgb(100, 181, 246)',
        backgroundColor: 'rgba(100, 181, 246, 0.5)',
        tension: 0.4,
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
        text: 'Account Balance History',
      },
    },
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
        <h2 className="text-xl font-semibold text-panda-primary mb-4">Account Overview</h2>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Total Balance</span>
            <span className="text-xl font-bold text-panda-primary">$14,000.00</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Available Balance</span>
            <span className="text-xl font-bold text-panda-success">$12,500.00</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Open Positions</span>
            <span className="text-xl font-bold text-panda-warning">3</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Total P/L</span>
            <span className="text-xl font-bold text-panda-success">+$4,000.00</span>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
        <h2 className="text-xl font-semibold text-panda-primary mb-4">Performance Chart</h2>
        <Line data={chartData} options={chartOptions} />
      </div>

      <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
        <h2 className="text-xl font-semibold text-panda-primary mb-4">Trading Statistics</h2>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">24h Volume</span>
            <span className="text-xl font-bold">$25,000.00</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Win Rate</span>
            <span className="text-xl font-bold text-panda-success">65%</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Total Trades</span>
            <span className="text-xl font-bold">156</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountOverview; 