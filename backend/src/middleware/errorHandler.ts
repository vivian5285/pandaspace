import { Request, Response, NextFunction } from 'express';
import { MonitoringService } from '../services/monitoringService';

const monitoringService = new MonitoringService();

export class AppError extends Error {
  statusCode: number;
  status: string;
  isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof AppError) {
    // 记录操作错误
    monitoringService.logError({
      type: 'operational',
      message: err.message,
      stack: err.stack,
      path: req.path,
      method: req.method,
      userId: req.user?.id,
    });

    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  }

  // 记录编程错误
  monitoringService.logError({
    type: 'programming',
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
    userId: req.user?.id,
  });

  // 生产环境不返回错误堆栈
  if (process.env.NODE_ENV === 'production') {
    return res.status(500).json({
      status: 'error',
      message: '服务器内部错误',
    });
  }

  // 开发环境返回详细错误信息
  return res.status(500).json({
    status: 'error',
    message: err.message,
    stack: err.stack,
  });
};

// 处理未捕获的异常
export const handleUncaughtException = (err: Error) => {
  monitoringService.logError({
    type: 'uncaught',
    message: err.message,
    stack: err.stack,
  });

  // 优雅关闭服务器
  process.exit(1);
};

// 处理未处理的 Promise 拒绝
export const handleUnhandledRejection = (reason: any, promise: Promise<any>) => {
  monitoringService.logError({
    type: 'unhandled_rejection',
    message: reason.message || '未处理的 Promise 拒绝',
    stack: reason.stack,
  });

  // 优雅关闭服务器
  process.exit(1);
}; 