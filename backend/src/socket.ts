import { Server } from 'socket.io';
import { createServer } from 'http';
import { app } from './app';
import { MonitoringService } from './services/monitoringService';

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

const monitoringService = new MonitoringService();

// 用户连接管理
const connectedUsers = new Map<string, string>();

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  // 用户认证
  socket.on('authenticate', async (userId: string) => {
    connectedUsers.set(socket.id, userId);
    console.log('User authenticated:', userId);

    // 发送用户特定的初始数据
    const userData = await getUserInitialData(userId);
    socket.emit('initialData', userData);
  });

  // 订阅交易更新
  socket.on('subscribeTrades', (userId: string) => {
    socket.join(`trades:${userId}`);
    console.log('User subscribed to trades:', userId);
  });

  // 订阅市场数据
  socket.on('subscribeMarket', (symbol: string) => {
    socket.join(`market:${symbol}`);
    console.log('Client subscribed to market:', symbol);
  });

  // 订阅系统通知
  socket.on('subscribeAlerts', (userId: string) => {
    socket.join(`alerts:${userId}`);
    console.log('User subscribed to alerts:', userId);
  });

  // 断开连接
  socket.on('disconnect', () => {
    const userId = connectedUsers.get(socket.id);
    if (userId) {
      connectedUsers.delete(socket.id);
      console.log('User disconnected:', userId);
    }
  });
});

// 发送交易更新
export const emitTradeUpdate = (userId: string, data: any) => {
  io.to(`trades:${userId}`).emit('tradeUpdate', data);
};

// 发送市场数据更新
export const emitMarketUpdate = (symbol: string, data: any) => {
  io.to(`market:${symbol}`).emit('marketUpdate', data);
};

// 发送系统通知
export const emitAlert = (userId: string, alert: any) => {
  io.to(`alerts:${userId}`).emit('alert', alert);
};

// 获取用户初始数据
async function getUserInitialData(userId: string): Promise<any> {
  try {
    const [activeTrades, recentProfits, marketData] = await Promise.all([
      getActiveTrades(userId),
      getRecentProfits(userId),
      getMarketData(),
    ]);

    return {
      activeTrades,
      recentProfits,
      marketData,
      timestamp: new Date(),
    };
  } catch (error) {
    console.error('Error getting user initial data:', error);
    return null;
  }
}

// 获取用户活跃交易
async function getActiveTrades(userId: string): Promise<any[]> {
  // 实现获取活跃交易的逻辑
  return [];
}

// 获取用户最近收益
async function getRecentProfits(userId: string): Promise<any[]> {
  // 实现获取最近收益的逻辑
  return [];
}

// 获取市场数据
async function getMarketData(): Promise<any> {
  // 实现获取市场数据的逻辑
  return {};
}

export { httpServer, io }; 