import React from 'react';

interface StrategyInfoProps {
  isActive: boolean;
  onToggle: () => void;
}

export const StrategyInfo: React.FC<StrategyInfoProps> = ({ isActive, onToggle }) => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">策略状态</h2>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-gray-600">当前状态</span>
          <span
            className={`px-2 py-1 text-sm rounded-full ${
              isActive
                ? 'bg-green-100 text-green-800'
                : 'bg-gray-100 text-gray-800'
            }`}
          >
            {isActive ? '运行中' : '已停止'}
          </span>
        </div>
        <button
          onClick={onToggle}
          className={`w-full px-4 py-2 rounded-md ${
            isActive
              ? 'bg-red-600 hover:bg-red-700 text-white'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          {isActive ? '停止策略' : '启用策略'}
        </button>
      </div>
    </div>
  );
}; 