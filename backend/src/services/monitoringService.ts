import { PrismaClient } from '@prisma/client';
import Redis from 'ioredis';
import { io } from '../socket';

const prisma = new PrismaClient();
const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

interface ErrorLog {
  type: string;
  message: string;
  stack?: string;
  path?: string;
  method?: string;
  userId?: string;
}

interface PerformanceMetric {
  endpoint: string;
  duration: number;
  timestamp: Date;
}

interface Alert {
  type: string;
  message: string;
  severity: 'low' | 'medium' | 'high';
  timestamp: Date;
}

export class MonitoringService {
  // 记录错误
  async logError(error: ErrorLog): Promise<void> {
    await prisma.errorLog.create({
      data: {
        type: error.type,
        message: error.message,
        stack: error.stack,
        path: error.path,
        method: error.method,
        userId: error.userId,
      },
    });

    // 发送错误通知
    this.sendAlert({
      type: 'error',
      message: error.message,
      severity: 'high',
      timestamp: new Date(),
    });
  }

  // 记录性能指标
  async logPerformance(metric: PerformanceMetric): Promise<void> {
    await prisma.performanceMetric.create({
      data: {
        endpoint: metric.endpoint,
        duration: metric.duration,
        timestamp: metric.timestamp,
      },
    });

    // 检查性能是否超过阈值
    if (metric.duration > 1000) { // 超过1秒
      this.sendAlert({
        type: 'performance',
        message: `Endpoint ${metric.endpoint} 响应时间过长: ${metric.duration}ms`,
        severity: 'medium',
        timestamp: new Date(),
      });
    }
  }

  // 记录交易执行
  async logTradeExecution(tradeId: string, status: string, error?: string): Promise<void> {
    await prisma.tradeExecutionLog.create({
      data: {
        tradeId,
        status,
        error,
        timestamp: new Date(),
      },
    });

    // 发送交易状态更新
    io.emit('tradeUpdate', {
      tradeId,
      status,
      timestamp: new Date(),
    });
  }

  // 记录用户活动
  async logUserActivity(userId: string, action: string, details?: any): Promise<void> {
    await prisma.userActivityLog.create({
      data: {
        userId,
        action,
        details: details ? JSON.stringify(details) : null,
        timestamp: new Date(),
      },
    });
  }

  // 发送告警
  private async sendAlert(alert: Alert): Promise<void> {
    await prisma.alert.create({
      data: {
        type: alert.type,
        message: alert.message,
        severity: alert.severity,
        timestamp: alert.timestamp,
      },
    });

    // 发送实时告警通知
    io.emit('alert', alert);

    // 根据严重程度采取不同措施
    switch (alert.severity) {
      case 'high':
        // 发送紧急通知
        await this.sendEmergencyNotification(alert);
        break;
      case 'medium':
        // 记录到监控面板
        await this.updateDashboard(alert);
        break;
      case 'low':
        // 仅记录日志
        console.log('Alert:', alert);
        break;
    }
  }

  // 发送紧急通知
  private async sendEmergencyNotification(alert: Alert): Promise<void> {
    // 实现紧急通知逻辑（例如：发送邮件、短信等）
    console.log('Emergency notification:', alert);
  }

  // 更新监控面板
  private async updateDashboard(alert: Alert): Promise<void> {
    // 实现监控面板更新逻辑
    console.log('Dashboard update:', alert);
  }

  // 获取系统状态
  async getSystemStatus(): Promise<any> {
    const [
      errorCount,
      performanceMetrics,
      activeTrades,
      userCount,
    ] = await Promise.all([
      prisma.errorLog.count({
        where: {
          timestamp: {
            gte: new Date(Date.now() - 24 * 60 * 60 * 1000), // 24小时内
          },
        },
      }),
      prisma.performanceMetric.findMany({
        where: {
          timestamp: {
            gte: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1小时内
          },
        },
        orderBy: {
          timestamp: 'desc',
        },
        take: 100,
      }),
      prisma.trade.count({
        where: {
          status: 'open',
        },
      }),
      prisma.user.count(),
    ]);

    return {
      errorCount,
      performanceMetrics,
      activeTrades,
      userCount,
      timestamp: new Date(),
    };
  }
} 