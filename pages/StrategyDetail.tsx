import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Switch } from '@headlessui/react';
import { ChartBarIcon, BeakerIcon, PlayIcon } from '@heroicons/react/outline';
import { strategyApi } from '../api/strategy';
import type { Strategy, StrategyMode } from '../types/strategy';
import { Spinner } from '../components/common/Spinner';
import { ErrorBox } from '../components/common/ErrorBox';
import { EmptyState } from '../components/common/EmptyState';
import { StrategyControl } from '../components/StrategyControl';

interface StrategyDetailProps {
  strategyId: string;
}

export default function StrategyDetail({ strategyId }: StrategyDetailProps) {
  const queryClient = useQueryClient();
  const [isConfirmingMode, setIsConfirmingMode] = useState(false);

  // 获取策略详情
  const { 
    data: strategy,
    isLoading,
    error,
    refetch
  } = useQuery(
    ['strategy', strategyId],
    () => strategyApi.getDetail(strategyId)
  );

  // 更新策略状态
  const statusMutation = useMutation(
    ({ status }: { status: 'active' | 'inactive' }) => 
      strategyApi.updateStatus(strategyId, status),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['strategy', strategyId]);
      }
    }
  );

  // 更新运行模式
  const modeMutation = useMutation(
    ({ mode }: { mode: StrategyMode }) => 
      strategyApi.updateMode(strategyId, mode),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['strategy', strategyId]);
        setIsConfirmingMode(false);
      }
    }
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ErrorBox 
          message="加载策略详情失败" 
          onRetry={() => refetch()} 
        />
      </div>
    );
  }

  if (!strategy) {
    return (
      <EmptyState
        title="未找到策略"
        description="该策略可能已被删除"
        icon={<ExclamationIcon className="h-12 w-12 text-gray-400" />}
        action={
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
          >
            返回
          </button>
        }
      />
    );
  }

  const handleStatusToggle = async () => {
    try {
      await statusMutation.mutateAsync({
        status: strategy.status === 'active' ? 'inactive' : 'active'
      });
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  const handleModeToggle = async () => {
    if (strategy.mode === 'simulation' && !isConfirmingMode) {
      setIsConfirmingMode(true);
      return;
    }

    try {
      await modeMutation.mutateAsync({
        mode: strategy.mode === 'simulation' ? 'live' : 'simulation'
      });
    } catch (error) {
      console.error('Failed to update mode:', error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* 策略基本信息 */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{strategy.name}</h1>
            <p className="mt-2 text-gray-500">{strategy.description}</p>
            <div className="mt-4 flex items-center space-x-4">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {strategy.type}
              </span>
              <span className="text-sm text-gray-500">
                创建于 {new Date(strategy.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
          <ChartBarIcon className="h-8 w-8 text-gray-400" />
        </div>
      </div>

      {/* 策略控制面板 */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-6">策略控制</h2>
        
        <div className="space-y-6">
          {/* 运行状态切换 */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <PlayIcon className="h-5 w-5 text-gray-400" />
              <span className="text-sm font-medium text-gray-700">运行状态</span>
            </div>
            <StrategyControl
              strategyId={strategyId}
              initialStatus={strategy.status}
              onStatusChange={handleStatusToggle}
            />
          </div>

          {/* 运行模式切换 */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <BeakerIcon className="h-5 w-5 text-gray-400" />
              <span className="text-sm font-medium text-gray-700">运行模式</span>
            </div>
            <div className="flex items-center space-x-4">
              {isConfirmingMode && (
                <div className="text-sm text-yellow-600">
                  确认切换到实盘模式？
                  <button
                    onClick={() => setIsConfirmingMode(false)}
                    className="ml-2 text-gray-500 hover:text-gray-700"
                  >
                    取消
                  </button>
                </div>
              )}
              <StrategyControl
                strategyId={strategyId}
                initialMode={strategy.mode}
                onModeChange={handleModeToggle}
              />
            </div>
          </div>
        </div>

        {/* 状态提示 */}
        {(statusMutation.isLoading || modeMutation.isLoading) && (
          <div className="mt-4 text-sm text-blue-600">
            正在更新策略设置...
          </div>
        )}
        {(statusMutation.isError || modeMutation.isError) && (
          <div className="mt-4 text-sm text-red-600">
            更新失败：{(statusMutation.error || modeMutation.error as Error)?.message}
          </div>
        )}
      </div>
    </div>
  );
} 
} 