import { PrismaClient } from '@prisma/client';
import { io } from '../socket';
import { Encryption } from '../utils/encryption';

const prisma = new PrismaClient();

interface Notification {
  userId: string;
  type: 'trade' | 'profit' | 'system' | 'alert';
  title: string;
  message: string;
  data?: any;
  read: boolean;
  createdAt: Date;
}

export class NotificationService {
  // 创建通知
  async createNotification(notification: Omit<Notification, 'read' | 'createdAt'>): Promise<Notification> {
    const newNotification = await prisma.notification.create({
      data: {
        ...notification,
        read: false,
        createdAt: new Date(),
      },
    });

    // 发送实时通知
    this.sendRealTimeNotification(newNotification);

    return newNotification;
  }

  // 发送实时通知
  private sendRealTimeNotification(notification: Notification): void {
    io.to(`notifications:${notification.userId}`).emit('notification', {
      ...notification,
      message: this.encryptSensitiveData(notification.message),
    });
  }

  // 获取用户通知
  async getUserNotifications(userId: string, page: number = 1, limit: number = 20): Promise<{
    notifications: Notification[];
    total: number;
  }> {
    const [notifications, total] = await Promise.all([
      prisma.notification.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.notification.count({ where: { userId } }),
    ]);

    return {
      notifications: notifications.map(notification => ({
        ...notification,
        message: this.encryptSensitiveData(notification.message),
      })),
      total,
    };
  }

  // 标记通知为已读
  async markAsRead(notificationId: string, userId: string): Promise<void> {
    await prisma.notification.update({
      where: {
        id: notificationId,
        userId,
      },
      data: {
        read: true,
      },
    });
  }

  // 标记所有通知为已读
  async markAllAsRead(userId: string): Promise<void> {
    await prisma.notification.updateMany({
      where: {
        userId,
        read: false,
      },
      data: {
        read: true,
      },
    });
  }

  // 删除通知
  async deleteNotification(notificationId: string, userId: string): Promise<void> {
    await prisma.notification.delete({
      where: {
        id: notificationId,
        userId,
      },
    });
  }

  // 发送交易通知
  async sendTradeNotification(userId: string, tradeData: any): Promise<void> {
    const notification = await this.createNotification({
      userId,
      type: 'trade',
      title: '交易执行通知',
      message: `您的交易已执行: ${tradeData.symbol} ${tradeData.type} ${tradeData.quantity}`,
      data: tradeData,
    });

    // 记录通知发送
    await this.logNotificationSent(notification);
  }

  // 发送收益通知
  async sendProfitNotification(userId: string, profitData: any): Promise<void> {
    const notification = await this.createNotification({
      userId,
      type: 'profit',
      title: '收益更新通知',
      message: `您的账户收益已更新: ${profitData.amount} USDT`,
      data: profitData,
    });

    // 记录通知发送
    await this.logNotificationSent(notification);
  }

  // 发送系统通知
  async sendSystemNotification(userId: string, systemData: any): Promise<void> {
    const notification = await this.createNotification({
      userId,
      type: 'system',
      title: '系统通知',
      message: systemData.message,
      data: systemData,
    });

    // 记录通知发送
    await this.logNotificationSent(notification);
  }

  // 发送告警通知
  async sendAlertNotification(userId: string, alertData: any): Promise<void> {
    const notification = await this.createNotification({
      userId,
      type: 'alert',
      title: '安全告警',
      message: alertData.message,
      data: alertData,
    });

    // 记录通知发送
    await this.logNotificationSent(notification);
  }

  // 记录通知发送
  private async logNotificationSent(notification: Notification): Promise<void> {
    await prisma.notificationLog.create({
      data: {
        notificationId: notification.id,
        userId: notification.userId,
        type: notification.type,
        status: 'sent',
        timestamp: new Date(),
      },
    });
  }

  // 加密敏感数据
  private encryptSensitiveData(message: string): string {
    // 实现敏感数据加密逻辑
    return message;
  }
} 