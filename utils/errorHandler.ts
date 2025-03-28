import { AxiosError } from 'axios';
import { notification } from 'antd';

export class ApiError extends Error {
  constructor(
    public code: number,
    message: string,
    public data?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export function handleError(error: Error | AxiosError | ApiError) {
  if (error instanceof ApiError) {
    notification.error({
      message: '业务错误',
      description: error.message,
    });
  } else if (axios.isAxiosError(error)) {
    // 处理网络错误
    notification.error({
      message: '网络错误',
      description: error.message,
    });
  } else {
    // 处理其他错误
    notification.error({
      message: '未知错误',
      description: error.message,
    });
  }
} 