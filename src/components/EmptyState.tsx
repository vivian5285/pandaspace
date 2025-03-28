import React from 'react';

interface EmptyStateProps {
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
  image?: 'strategy' | 'profit' | 'referral';
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  actionText,
  onAction,
  image = 'strategy'
}) => {
  // 根据不同场景选择不同的插图
  const illustrations = {
    strategy: (
      <svg className="w-64 h-64" viewBox="0 0 400 400" fill="none">
        {/* 简化的熊猫插图 - 策略场景 */}
        <circle cx="200" cy="200" r="160" fill="#F3F4F6"/>
        <circle cx="200" cy="200" r="120" fill="white"/>
        {/* 熊猫眼睛 */}
        <ellipse cx="160" cy="160" rx="30" ry="40" fill="#111827"/>
        <ellipse cx="240" cy="160" rx="30" ry="40" fill="#111827"/>
        {/* 熊猫鼻子 */}
        <circle cx="200" cy="200" r="20" fill="#111827"/>
        {/* 熊猫耳朵 */}
        <path d="M120 100C120 80 140 60 160 60C180 60 200 80 200 100C200 120 180 140 160 140C140 140 120 120 120 100Z" fill="#111827"/>
        <path d="M200 100C200 80 220 60 240 60C260 60 280 80 280 100C280 120 260 140 240 140C220 140 200 120 200 100Z" fill="#111827"/>
        {/* 图表元素 */}
        <path d="M140 280L180 240L220 260L260 220" stroke="#3B82F6" strokeWidth="4"/>
      </svg>
    ),
    profit: (
      <svg className="w-64 h-64" viewBox="0 0 400 400" fill="none">
        {/* 简化的熊猫插图 - 收益场景 */}
        <circle cx="200" cy="200" r="160" fill="#F3F4F6"/>
        <circle cx="200" cy="200" r="120" fill="white"/>
        {/* 熊猫眼睛 - 变成钱币符号 */}
        <text x="160" y="180" fontSize="50" fill="#111827">$</text>
        <text x="240" y="180" fontSize="50" fill="#111827">$</text>
        {/* 熊猫鼻子 */}
        <circle cx="200" cy="200" r="20" fill="#111827"/>
        {/* 熊猫耳朵 */}
        <path d="M120 100C120 80 140 60 160 60C180 60 200 80 200 100C200 120 180 140 160 140C140 140 120 120 120 100Z" fill="#111827"/>
        <path d="M200 100C200 80 220 60 240 60C260 60 280 80 280 100C280 120 260 140 240 140C220 140 200 120 200 100Z" fill="#111827"/>
        {/* 上升箭头 */}
        <path d="M180 280L200 240L220 280" stroke="#10B981" strokeWidth="4"/>
      </svg>
    ),
    referral: (
      <svg className="w-64 h-64" viewBox="0 0 400 400" fill="none">
        {/* 简化的熊猫插图 - 推广场景 */}
        <circle cx="200" cy="200" r="160" fill="#F3F4F6"/>
        <circle cx="200" cy="200" r="120" fill="white"/>
        {/* 熊猫眼睛 - 爱心形状 */}
        <path d="M160 160C160 140 140 140 140 160C140 180 160 190 160 190C160 190 180 180 180 160C180 140 160 140 160 160Z" fill="#111827"/>
        <path d="M240 160C240 140 220 140 220 160C220 180 240 190 240 190C240 190 260 180 260 160C260 140 240 140 240 160Z" fill="#111827"/>
        {/* 熊猫鼻子 */}
        <circle cx="200" cy="200" r="20" fill="#111827"/>
        {/* 熊猫耳朵 */}
        <path d="M120 100C120 80 140 60 160 60C180 60 200 80 200 100C200 120 180 140 160 140C140 140 120 120 120 100Z" fill="#111827"/>
        <path d="M200 100C200 80 220 60 240 60C260 60 280 80 280 100C280 120 260 140 240 140C220 140 200 120 200 100Z" fill="#111827"/>
        {/* 连接线 */}
        <path d="M160 280H240" stroke="#6366F1" strokeWidth="4" strokeDasharray="8 8"/>
      </svg>
    ),
  };

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      {/* 插图区域 */}
      <div className="mb-8 animate-float">
        {illustrations[image]}
      </div>

      {/* 文案区域 */}
      <div className="text-center max-w-md">
        <h3 className="text-xl font-medium text-gray-900 mb-2">
          {title}
        </h3>
        <p className="text-gray-500 mb-6">
          {description}
        </p>

        {/* 操作按钮 */}
        {actionText && onAction && (
          <button
            onClick={onAction}
            className="inline-flex items-center px-6 py-3 border border-transparent 
                     text-base font-medium rounded-full shadow-sm text-white 
                     bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 
                     focus:ring-offset-2 focus:ring-blue-500 transition-colors
                     duration-200"
          >
            {actionText}
          </button>
        )}
      </div>
    </div>
  );
}; 