import { io, Socket } from 'socket.io-client';

class WebSocketService {
  private socket: Socket | null = null;
  private static instance: WebSocketService;

  private constructor() {}

  static getInstance(): WebSocketService {
    if (!WebSocketService.instance) {
      WebSocketService.instance = new WebSocketService();
    }
    return WebSocketService.instance;
  }

  connect() {
    if (!this.socket) {
      this.socket = io('ws://localhost:3000', {
        transports: ['websocket'],
        autoConnect: true,
      });

      this.socket.on('connect', () => {
        console.log('WebSocket connected');
      });

      this.socket.on('disconnect', () => {
        console.log('WebSocket disconnected');
      });
    }
  }

  subscribeToMarketData(callback: (data: any) => void) {
    if (this.socket) {
      this.socket.on('marketData', callback);
    }
  }

  subscribeToPositionUpdates(callback: (data: any) => void) {
    if (this.socket) {
      this.socket.on('positionUpdate', callback);
    }
  }

  subscribeToStrategyUpdates(callback: (data: any) => void) {
    if (this.socket) {
      this.socket.on('strategyUpdate', callback);
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }
}

export default WebSocketService; 