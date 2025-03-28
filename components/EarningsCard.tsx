import React from 'react';
import { ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/solid';

interface EarningsCardProps {
  title: string;
  amount: number;
  trend: number;
}

export function EarningsCard({ title, amount, trend }: EarningsCardProps) {
  const isPositive = trend >= 0;

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-sm font-medium text-gray-500">{title}</h3>
      <div className="mt-2 flex items-baseline">
        <p className="text-2xl font-semibold text-gray-900">
          ${amount.toFixed(2)}
        </p>
        <span className={`ml-2 flex items-baseline text-sm ${
          isPositive ? 'text-green-600' : 'text-red-600'
        }`}>
          {isPositive ? (
            <ArrowUpIcon className="w-3 h-3 flex-shrink-0" />
          ) : (
            <ArrowDownIcon className="w-3 h-3 flex-shrink-0" />
          )}
          <span className="ml-1">{Math.abs(trend)}%</span>
        </span>
      </div>
    </div>
  );
} 