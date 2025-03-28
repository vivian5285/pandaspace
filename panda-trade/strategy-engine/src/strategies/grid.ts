import { StrategyRunner, StrategyResult } from '../core/interfaces';

export class GridStrategy implements StrategyRunner {
  async run(userId: string, config: any): Promise<StrategyResult> {
    const profit = +(Math.random() * 3 - 0.5).toFixed(2); // -0.5% ~ +2.5%
    const isProfit = profit >= 0;

    return {
      profitPercent: profit,
      message: isProfit
        ? `网格吃单盈利 [+${profit}%]`
        : `突破网格区间，小幅回撤 [${profit}%]`,
    };
  }
} 