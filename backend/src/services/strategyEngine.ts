import { PrismaClient } from '@prisma/client';
import { BinanceService } from './binanceService';
import { MonitoringService } from './monitoringService';

const prisma = new PrismaClient();
const monitoringService = new MonitoringService();

interface MarketData {
  symbol: string;
  currentPrice: number;
  priceChange: number;
  volume: number;
  timestamp: Date;
}

interface StrategyConfig {
  type: 'scalping' | 'supertrend' | 'grid';
  leverage: number;
  stopLoss: number;
  takeProfit: number;
  gridSpacing?: number;
}

export class StrategyEngine {
  private binanceService: BinanceService;

  constructor() {
    this.binanceService = new BinanceService();
  }

  // 选择策略
  async selectStrategy(userId: string, marketData: MarketData): Promise<StrategyConfig> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { riskProfile: true },
    });

    if (!user) {
      throw new Error('User not found');
    }

    const riskScore = user.riskProfile?.score || 5;
    let strategyType: 'scalping' | 'supertrend' | 'grid';

    if (riskScore >= 7) {
      strategyType = 'scalping';
    } else if (riskScore >= 4) {
      strategyType = 'grid';
    } else {
      strategyType = 'supertrend';
    }

    return {
      type: strategyType,
      leverage: this.calculateLeverage(riskScore),
      stopLoss: 0.03,
      takeProfit: 0.10,
      gridSpacing: 0.01,
    };
  }

  // 执行策略
  async executeStrategy(
    userId: string,
    strategyConfig: StrategyConfig,
    marketData: MarketData
  ): Promise<void> {
    try {
      const trade = await prisma.trade.create({
        data: {
          userId,
          strategyId: strategyConfig.type,
          symbol: marketData.symbol,
          type: this.determineTradeType(marketData, strategyConfig),
          entryPrice: marketData.currentPrice,
          quantity: this.calculateTradeQuantity(userId, strategyConfig),
          status: 'open',
        },
      });

      await monitoringService.logTradeExecution(trade.id, 'started');

      switch (strategyConfig.type) {
        case 'scalping':
          await this.executeScalpingStrategy(trade, marketData, strategyConfig);
          break;
        case 'supertrend':
          await this.executeSuperTrendStrategy(trade, marketData, strategyConfig);
          break;
        case 'grid':
          await this.executeGridStrategy(trade, marketData, strategyConfig);
          break;
      }

      await monitoringService.logTradeExecution(trade.id, 'completed');
    } catch (error) {
      await monitoringService.logTradeExecution(trade.id, 'failed', error.message);
      throw error;
    }
  }

  // 剥头皮策略
  private async executeScalpingStrategy(
    trade: any,
    marketData: MarketData,
    config: StrategyConfig
  ): Promise<void> {
    if (Math.abs(marketData.priceChange) < 0.02) {
      const order = await this.binanceService.createOrder({
        symbol: marketData.symbol,
        side: marketData.priceChange > 0 ? 'BUY' : 'SELL',
        type: 'MARKET',
        quantity: trade.quantity,
        leverage: config.leverage,
      });

      await this.updateTradeStatus(trade.id, order);
    }
  }

  // 超级趋势策略
  private async executeSuperTrendStrategy(
    trade: any,
    marketData: MarketData,
    config: StrategyConfig
  ): Promise<void> {
    const trend = await this.calculateTrend(marketData.symbol);
    if (trend === 'up') {
      const order = await this.binanceService.createOrder({
        symbol: marketData.symbol,
        side: 'BUY',
        type: 'MARKET',
        quantity: trade.quantity,
        leverage: config.leverage,
        stopLoss: marketData.currentPrice * (1 - config.stopLoss),
        takeProfit: marketData.currentPrice * (1 + config.takeProfit),
      });

      await this.updateTradeStatus(trade.id, order);
    }
  }

  // 网格策略
  private async executeGridStrategy(
    trade: any,
    marketData: MarketData,
    config: StrategyConfig
  ): Promise<void> {
    const gridLevels = this.calculateGridLevels(marketData.currentPrice, config.gridSpacing);
    const currentLevel = this.findCurrentGridLevel(marketData.currentPrice, gridLevels);

    if (currentLevel !== null) {
      const order = await this.binanceService.createOrder({
        symbol: marketData.symbol,
        side: currentLevel === 'lower' ? 'BUY' : 'SELL',
        type: 'MARKET',
        quantity: trade.quantity,
        leverage: config.leverage,
      });

      await this.updateTradeStatus(trade.id, order);
    }
  }

  // 辅助方法
  private calculateLeverage(riskScore: number): number {
    if (riskScore >= 8) return 5;
    if (riskScore >= 6) return 3;
    if (riskScore >= 4) return 2;
    return 1;
  }

  private determineTradeType(marketData: MarketData, config: StrategyConfig): 'long' | 'short' {
    if (config.type === 'scalping') {
      return marketData.priceChange > 0 ? 'long' : 'short';
    }
    return 'long'; // 默认做多
  }

  private async calculateTradeQuantity(userId: string, config: StrategyConfig): Promise<number> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error('User not found');
    }

    const baseQuantity = user.initialInvestment * 0.1; // 使用10%的资金
    return baseQuantity * config.leverage;
  }

  private async calculateTrend(symbol: string): Promise<'up' | 'down'> {
    // 实现趋势计算逻辑
    return 'up';
  }

  private calculateGridLevels(currentPrice: number, spacing: number): number[] {
    const levels = [];
    for (let i = -5; i <= 5; i++) {
      levels.push(currentPrice * (1 + i * spacing));
    }
    return levels;
  }

  private findCurrentGridLevel(currentPrice: number, levels: number[]): 'lower' | 'upper' | null {
    const sortedLevels = [...levels].sort((a, b) => a - b);
    const currentIndex = sortedLevels.findIndex(level => level > currentPrice);

    if (currentIndex === -1) return 'upper';
    if (currentIndex === 0) return 'lower';
    if (currentIndex === sortedLevels.length) return 'lower';

    const lowerLevel = sortedLevels[currentIndex - 1];
    const upperLevel = sortedLevels[currentIndex];
    const midPoint = (lowerLevel + upperLevel) / 2;

    return currentPrice < midPoint ? 'lower' : 'upper';
  }

  private async updateTradeStatus(tradeId: string, order: any): Promise<void> {
    await prisma.trade.update({
      where: { id: tradeId },
      data: {
        exitPrice: order.price,
        profit: order.realizedPnl,
        status: 'closed',
      },
    });
  }
} 