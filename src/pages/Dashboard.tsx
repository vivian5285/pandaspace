import React from 'react';
import { ProfitChart } from '../components/ProfitChart';

export const Dashboard: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">收益总览</h1>
      
      {/* 收益图表 */}
      <ProfitChart className="mb-8" />
      
      {/* 其他内容 */}
    </div>
  );
}; 