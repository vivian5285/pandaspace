import { StrategyRunner } from './interfaces';
import { SuperTrendStrategy } from '../strategies/superTrend';
import { ScalpingStrategy } from '../strategies/scalping';
import { GridStrategy } from '../strategies/grid';

export class StrategyManager {
  private static instance: StrategyManager;
  private strategies: Map<string, StrategyRunner>;

  private constructor() {
    this.strategies = new Map([
      ['super-trend', new SuperTrendStrategy()],
      ['scalping', new ScalpingStrategy()],
      ['grid', new GridStrategy()],
    ]);
  }

  static getInstance(): StrategyManager {
    if (!StrategyManager.instance) {
      StrategyManager.instance = new StrategyManager();
    }
    return StrategyManager.instance;
  }

  getStrategy(type: string): StrategyRunner | undefined {
    return this.strategies.get(type);
  }

  getAllStrategyTypes(): string[] {
    return Array.from(this.strategies.keys());
  }
} 