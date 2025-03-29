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
  ChartOptions,
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

interface AccountChartProps {
  data: {
    labels: string[];
    values: number[];
  };
  darkMode?: boolean;
}

const AccountChart: React.FC<AccountChartProps> = ({ data, darkMode = false }) => {
  const chartData = {
    labels: data.labels,
    datasets: [
      {
        label: 'Account Balance',
        data: data.values,
        borderColor: darkMode ? '#64b5f6' : '#1a1a1a',
        backgroundColor: darkMode ? 'rgba(100, 181, 246, 0.2)' : 'rgba(26, 26, 26, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const options: ChartOptions<'line'> = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: darkMode ? '#ffffff' : '#1a1a1a',
        },
      },
      title: {
        display: true,
        text: 'Account Balance History',
        color: darkMode ? '#ffffff' : '#1a1a1a',
      },
    },
    scales: {
      y: {
        grid: {
          color: darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          color: darkMode ? '#ffffff' : '#1a1a1a',
        },
      },
      x: {
        grid: {
          color: darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          color: darkMode ? '#ffffff' : '#1a1a1a',
        },
      },
    },
  };

  return <Line data={chartData} options={options} />;
};

export default AccountChart; 