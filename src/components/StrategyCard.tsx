import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ChartBarIcon, 
  PlayIcon, 
  StopIcon 
} from '@heroicons/react/24/outline';

interface StrategyCardProps {
  id: string;
  name: string;
  isActive: boolean;
  returnRate: {
    daily: number;
    monthly: number;
    total: number;
  };
  description: string;
  onToggle: (id: string) => void;
  loading?: boolean;
}

export const StrategyCard: React.FC<StrategyCardProps> = ({
  id,
  name,
  isActive,
  returnRate,
  description,
  onToggle,
  loading = false,
}) => {
  const navigate = useNavigate();

  const handleCardClick = (e: React.MouseEvent) => {
    // 如果点击的是按钮，不进行跳转
    if ((e.target as HTMLElement).closest('button')) {
      return;
    }
    navigate(`/strategy/${id}`);
  };

  return (
    <div
      onClick={handleCardClick}
      className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 
                cursor-pointer border border-gray-100 overflow-hidden group"
    >
      <div className="p-6 space-y-4">
        {/* 标题和状态 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <ChartBarIcon className="h-6 w-6 text-blue-500" />
            <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 
                         transition-colors duration-300">
              {name}
            </h3>
          </div>
          <span
            className={`px-2.5 py-1 rounded-full text-sm font-medium ${
              isActive
                ? 'bg-green-100 text-green-800'
                : 'bg-gray-100 text-gray-800'
            }`}
          >
            {isActive ? '运行中' : '已停止'}
          </span>
        </div>

        {/* 策略描述 */}
        <p className="text-sm text-gray-600 line-clamp-2">{description}</p>

        {/* 收益数据 */}
        <div className="grid grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-gray-500">今日收益</p>
            <p className={`text-lg font-semibold ${
              returnRate.daily >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {returnRate.daily > 0 ? '+' : ''}{returnRate.daily}%
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">月收益</p>
            <p className={`text-lg font-semibold ${
              returnRate.monthly >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {returnRate.monthly > 0 ? '+' : ''}{returnRate.monthly}%
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">总收益</p>
            <p className={`text-lg font-semibold ${
              returnRate.total >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {returnRate.total > 0 ? '+' : ''}{returnRate.total}%
            </p>
          </div>
        </div>

        {/* 操作按钮 */}
        <div className="pt-4 border-t border-gray-100">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggle(id);
            }}
            disabled={loading}
            className={`w-full flex items-center justify-center px-4 py-2 rounded-md
                      text-sm font-medium transition-colors duration-300
                      ${loading ? 'opacity-50 cursor-not-allowed' : ''}
                      ${
                        isActive
                          ? 'bg-red-50 text-red-600 hover:bg-red-100'
                          : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                      }`}
          >
            {loading ? (
              <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
            ) : isActive ? (
              <>
                <StopIcon className="h-5 w-5 mr-2" />
                停止策略
              </>
            ) : (
              <>
                <PlayIcon className="h-5 w-5 mr-2" />
                启用策略
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}; 