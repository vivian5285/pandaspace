import React from 'react';

interface ParamsProps {
  params: {
    stopLoss: number;
    takeProfit: number;
    leverage: number;
    interval: string;
  };
}

export const StrategyParams: React.FC<ParamsProps> = ({ params }) => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">策略参数</h2>
      <form className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              止损比例 (%)
            </label>
            <input
              type="number"
              defaultValue={params.stopLoss}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              止盈比例 (%)
            </label>
            <input
              type="number"
              defaultValue={params.takeProfit}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              杠杆倍数
            </label>
            <input
              type="number"
              defaultValue={params.leverage}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              交易周期
            </label>
            <select
              defaultValue={params.interval}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="15m">15分钟</option>
              <option value="1h">1小时</option>
              <option value="4h">4小时</option>
              <option value="1d">1天</option>
            </select>
          </div>
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            保存参数
          </button>
        </div>
      </form>
    </div>
  );
}; 