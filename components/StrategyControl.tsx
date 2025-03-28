import React, { useState } from 'react';
import { Spinner } from './common/Spinner';
import { Toast } from './common/Toast';
import { useToast } from '../hooks/useToast';
import { strategyApi } from '../api/services';

interface StrategyControlProps {
  strategyId: string;
  initialStatus: 'active' | 'inactive';
  onStatusChange: (newStatus: 'active' | 'inactive') => void;
}

export function StrategyControl({ 
  strategyId, 
  initialStatus, 
  onStatusChange 
}: StrategyControlProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState(initialStatus);
  const { toast, showToast, hideToast } = useToast();

  const handleToggle = async () => {
    setIsLoading(true);
    try {
      const newStatus = status === 'active' ? 'inactive' : 'active';
      
      // 调用 API
      if (newStatus === 'active') {
        await strategyApi.enable(strategyId);
      } else {
        await strategyApi.disable(strategyId);
      }

      // 更新状态
      setStatus(newStatus);
      onStatusChange(newStatus);
      showToast(
        `策略${newStatus === 'active' ? '启用' : '停用'}成功`,
        'success'
      );
    } catch (error) {
      showToast(
        error instanceof Error ? error.message : '操作失败',
        'error'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={handleToggle}
        disabled={isLoading}
        className={`
          inline-flex items-center px-4 py-2 border rounded-md shadow-sm text-sm font-medium
          ${status === 'active'
            ? 'border-red-300 text-red-700 bg-red-50 hover:bg-red-100'
            : 'border-green-300 text-green-700 bg-green-50 hover:bg-green-100'
          }
          ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
          focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
        `}
      >
        {isLoading ? (
          <>
            <Spinner size="sm" />
            <span className="ml-2">
              {status === 'active' ? '停用中...' : '启用中...'}
            </span>
          </>
        ) : (
          status === 'active' ? '停用策略' : '启用策略'
        )}
      </button>

      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={hideToast}
      />
    </div>
  );
} 