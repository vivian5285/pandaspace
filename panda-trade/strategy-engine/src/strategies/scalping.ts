import { StrategyRunner, StrategyResult } from '../core/interfaces';

export class ScalpingStrategy implements StrategyRunner {
  async run(userId: string, config: any): Promise<StrategyResult> {
    const profit = +(Math.random() * 5 - 3).toFixed(2); // -3% ~ +2%
    const isProfit = profit >= 0;

    return {
      profitPercent: profit,
      message: isProfit
        ? `快速吃到价差 [+${profit}%]`
        : `滑点过大，止损出场 [${profit}%]`,
    };
  }
} 