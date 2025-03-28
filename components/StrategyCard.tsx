import React from 'react';
import { Switch } from '@headlessui/react';
import type { Strategy } from '../types/dashboard';
import { motion } from 'framer-motion';

interface StrategyCardProps {
  strategy: Strategy;
  onToggle: (enabled: boolean) => void;
  isLoading?: boolean;
}

export function StrategyCard({ strategy, onToggle, isLoading }: StrategyCardProps) {
  if (isLoading) {
    return <StrategyCardSkeleton />;
  }

  const isActive = strategy.status === 'active';

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
    >
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-medium text-gray-900">{strategy.name}</h3>
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
          }`}>
            {isActive ? '运行中' : '已停用'}
          </span>
        </div>
        <Switch
          checked={isActive}
          onChange={onToggle}
          className={`${
            isActive ? 'bg-blue-600' : 'bg-gray-200'
          } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
        >
          <span className="sr-only">启用策略</span>
          <span
            className={`${
              isActive ? 'translate-x-6' : 'translate-x-1'
            } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
          />
        </Switch>
      </div>
      
      <div className="mt-4">
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">收益率</span>
          <span className={`font-medium ${
            strategy.returnRate >= 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            {strategy.returnRate >= 0 ? '+' : ''}{strategy.returnRate}%
          </span>
        </div>
      </div>
    </motion.div>
  );
}

function StrategyCardSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 animate-pulse">
      <div className="h-6 bg-gray-200 rounded w-3/4 mb-4" />
      <div className="space-y-3">
        <div className="h-4 bg-gray-200 rounded w-1/2" />
        <div className="h-4 bg-gray-200 rounded w-1/3" />
      </div>
    </div>
  );
} 