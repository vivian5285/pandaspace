import React from 'react';

export const UserStats: React.FC = () => {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
      <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <dt className="text-sm font-medium text-gray-500">今日收益</dt>
          <dd className="mt-1 text-3xl font-semibold text-gray-900">+2.8%</dd>
        </div>
      </div>
      <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <dt className="text-sm font-medium text-gray-500">月收益</dt>
          <dd className="mt-1 text-3xl font-semibold text-gray-900">+12.5%</dd>
        </div>
      </div>
      <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <dt className="text-sm font-medium text-gray-500">总收益</dt>
          <dd className="mt-1 text-3xl font-semibold text-gray-900">+45.2%</dd>
        </div>
      </div>
    </div>
  );
}; 