import React from 'react';

export const ReferralStats: React.FC = () => {
  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-4">推广数据</h2>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {/* 一级下线 */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <dt className="text-sm font-medium text-gray-500">一级下线</dt>
            <dd className="mt-1 text-3xl font-semibold text-gray-900">128人</dd>
            <p className="mt-1 text-sm text-gray-600">本月新增 12 人</p>
          </div>
        </div>

        {/* 二级下线 */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <dt className="text-sm font-medium text-gray-500">二级下线</dt>
            <dd className="mt-1 text-3xl font-semibold text-gray-900">256人</dd>
            <p className="mt-1 text-sm text-gray-600">本月新增 28 人</p>
          </div>
        </div>

        {/* 本月收益 */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <dt className="text-sm font-medium text-gray-500">本月推广收益</dt>
            <dd className="mt-1 text-3xl font-semibold text-gray-900">¥2,580</dd>
            <p className="mt-1 text-sm text-green-600">较上月 +15.8%</p>
          </div>
        </div>

        {/* 累计收益 */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <dt className="text-sm font-medium text-gray-500">累计推广收益</dt>
            <dd className="mt-1 text-3xl font-semibold text-gray-900">¥15,800</dd>
            <p className="mt-1 text-sm text-gray-600">已结算 ¥12,500</p>
          </div>
        </div>
      </div>
    </div>
  );
}; 