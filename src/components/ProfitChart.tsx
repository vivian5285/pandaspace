import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Area,
  AreaChart,
} from 'recharts';

interface ProfitData {
  date: string;
  profit: number;
  accumulated: number;
}

interface ProfitChartProps {
  title?: string;
  className?: string;
}

export const ProfitChart: React.FC<ProfitChartProps> = ({ 
  title = "收益走势", 
  className = "" 
}) => {
  // 时间范围选择
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');
  
  // 生成模拟数据
  const data = useMemo(() => {
    const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
    const result: ProfitData[] = [];
    let accumulated = 0;
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      // 生成-5到5之间的随机收益率
      const profit = Number((Math.random() * 10 - 5).toFixed(2));
      accumulated += profit;
      
      result.push({
        date: date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' }),
        profit,
        accumulated: Number(accumulated.toFixed(2))
      });
    }
    
    return result;
  }, [timeRange]);

  // 自定义 tooltip 内容
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="text-sm text-gray-600 mb-1">{label}</p>
          <p className="text-sm font-medium">
            <span className="text-blue-600">日收益: </span>
            <span className={payload[0].value >= 0 ? 'text-green-600' : 'text-red-600'}>
              {payload[0].value > 0 ? '+' : ''}{payload[0].value}%
            </span>
          </p>
          <p className="text-sm font-medium">
            <span className="text-blue-600">累计收益: </span>
            <span className={payload[1].value >= 0 ? 'text-green-600' : 'text-red-600'}>
              {payload[1].value > 0 ? '+' : ''}{payload[1].value}%
            </span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className={`bg-white rounded-lg shadow-sm p-6 ${className}`}>
      {/* 标题和时间范围选择 */}
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <div className="flex space-x-2">
          {(['7d', '30d', '90d'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1 text-sm rounded-md transition-colors
                ${timeRange === range
                  ? 'bg-blue-100 text-blue-600'
                  : 'text-gray-600 hover:bg-gray-100'
                }`}
            >
              {range === '7d' ? '7天' : range === '30d' ? '30天' : '90天'}
            </button>
          ))}
        </div>
      </div>

      {/* 图表区域 */}
      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="profitGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.1}/>
                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis
              dataKey="date"
              stroke="#6B7280"
              fontSize={12}
              tickLine={false}
            />
            <YAxis
              stroke="#6B7280"
              fontSize={12}
              tickLine={false}
              tickFormatter={(value) => `${value}%`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Area
              type="monotone"
              dataKey="profit"
              name="日收益"
              stroke="#3B82F6"
              fill="url(#profitGradient)"
              strokeWidth={2}
            />
            <Line
              type="monotone"
              dataKey="accumulated"
              name="累计收益"
              stroke="#10B981"
              strokeWidth={2}
              dot={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* 数据概览 */}
      <div className="grid grid-cols-3 gap-4 mt-6">
        <div>
          <p className="text-sm text-gray-500">期间最高收益</p>
          <p className="text-lg font-semibold text-green-600">
            +{Math.max(...data.map(d => d.profit)).toFixed(2)}%
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-500">期间最低收益</p>
          <p className="text-lg font-semibold text-red-600">
            {Math.min(...data.map(d => d.profit)).toFixed(2)}%
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-500">累计收益</p>
          <p className={`text-lg font-semibold ${
            data[data.length - 1].accumulated >= 0 
              ? 'text-green-600' 
              : 'text-red-600'
          }`}>
            {data[data.length - 1].accumulated > 0 ? '+' : ''}
            {data[data.length - 1].accumulated}%
          </p>
        </div>
      </div>
    </div>
  );
}; 