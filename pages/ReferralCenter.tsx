import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { ClipboardCopyIcon, UserGroupIcon, CashIcon } from '@heroicons/react/outline';
import { referralApi } from '@/api/services';
import { ErrorAlert } from '../components/ErrorAlert';
import { LoadingSpinner } from '../components/LoadingSpinner';
import type { ReferralRecord } from '../types/referral';

export default function ReferralCenter() {
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [copied, setCopied] = useState(false);

  // 获取用户信息
  const { 
    data: profile,
    isLoading: profileLoading,
    error: profileError
  } = useQuery(['userProfile'], referralApi.getUserProfile);

  // 获取推广统计
  const {
    data: stats,
    isLoading: statsLoading,
    error: statsError
  } = useQuery(
    ['referralStats'],
    referralApi.getStats
  );

  // 获取推广历史
  const {
    data: history,
    isLoading: historyLoading,
    error: historyError
  } = useQuery(
    ['referralHistory', 1],
    () => referralApi.getHistory({ page: 1, pageSize: 10 })
  );

  // 复制邀请链接
  const handleCopyLink = async () => {
    if (!profile?.myInviteCode) return;
    
    try {
      const inviteLink = `${window.location.origin}/register?code=${profile.myInviteCode}`;
      await navigator.clipboard.writeText(inviteLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  // 显示加载状态
  if (profileLoading || statsLoading) {
    return <LoadingSpinner />;
  }

  // 显示错误信息
  if (profileError || statsError) {
    return (
      <ErrorAlert 
        message="加载推广数据失败" 
        detail={(profileError || statsError)?.message} 
      />
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* 邀请码卡片 */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">我的邀请码</h2>
            <p className="mt-1 text-3xl font-bold text-blue-600">
              {profile?.myInviteCode}
            </p>
          </div>
          <button
            onClick={handleCopyLink}
            className={`mt-4 md:mt-0 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
              copied 
                ? 'bg-green-600 hover:bg-green-700' 
                : 'bg-blue-600 hover:bg-blue-700'
            } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
          >
            <ClipboardCopyIcon className="h-5 w-5 mr-2" />
            {copied ? '已复制' : '复制邀请链接'}
          </button>
        </div>
      </div>

      {/* 统计数据卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <UserGroupIcon className="h-8 w-8 text-blue-500" />
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">一级邀请</h3>
              <p className="text-2xl font-semibold text-gray-900">
                {stats?.level1Count || 0}人
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <UserGroupIcon className="h-8 w-8 text-indigo-500" />
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">二级邀请</h3>
              <p className="text-2xl font-semibold text-gray-900">
                {stats?.level2Count || 0}人
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <CashIcon className="h-8 w-8 text-green-500" />
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">累计返佣</h3>
              <p className="text-2xl font-semibold text-gray-900">
                ${stats?.totalEarnings.toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 返佣记录表格 */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">返佣记录</h2>
        </div>

        {historyLoading ? (
          <div className="p-8 flex justify-center">
            <LoadingSpinner />
          </div>
        ) : historyError ? (
          <ErrorAlert 
            message="加载返佣记录失败" 
            detail={historyError.message} 
          />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      来源用户
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      层级
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      返佣金额
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      时间
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {history?.data.map((record: ReferralRecord) => (
                    <tr key={record.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {record.sourceUser}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          record.level === 1
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-indigo-100 text-indigo-800'
                        }`}>
                          {record.level}级
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">
                        +${record.amount.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {format(new Date(record.timestamp), 'yyyy-MM-dd HH:mm')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* 分页控件 */}
            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1 || historyLoading}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                上一页
              </button>
              <span className="text-sm text-gray-700">
                第 {page} 页 / 共 {Math.ceil((history?.total || 0) / pageSize)} 页
              </span>
              <button
                onClick={() => setPage(p => p + 1)}
                disabled={!history?.data.length || history.data.length < pageSize || historyLoading}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                下一页
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
} 