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
  ChartOptions
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

interface TradingChartProps {
  data: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      borderColor: string;
      backgroundColor?: string;
      tension?: number;
    }[];
  };
  height?: number;
  showLegend?: boolean;
  showGrid?: boolean;
  title?: string;
}

const TradingChart: React.FC<TradingChartProps> = ({
  data,
  height = 300,
  showLegend = true,
  showGrid = true,
  title
}) => {
  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: showLegend,
        position: 'top' as const,
      },
      title: {
        display: !!title,
        text: title
      },
    },
    scales: {
      y: {
        display: showGrid,
        grid: {
          display: showGrid,
          color: 'rgba(0, 0, 0, 0.1)',
        }
      },
      x: {
        display: showGrid,
        grid: {
          display: showGrid,
          color: 'rgba(0, 0, 0, 0.1)',
        }
      }
    },
    interaction: {
      intersect: false,
      mode: 'index' as const,
    },
    elements: {
      point: {
        radius: 0,
        hitRadius: 10,
        hoverRadius: 4,
      }
    }
  };

  return (
    <div style={{ height }}>
      <Line data={data} options={options} />
    </div>
  );
};

export default TradingChart; 