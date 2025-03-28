import { StrategyRunner, StrategyResult } from '../core/interfaces';

export class SuperTrendStrategy implements StrategyRunner {
  async run(userId: string, config: any): Promise<StrategyResult> {
    const isTrending = Math.random() < 0.3; // 30% 概率有趋势
    const profit = isTrending
      ? +(Math.random() * 3.5).toFixed(2)   // 0 ~ +3.5%
      : +(-Math.random() * 1.5).toFixed(2); // -1.5 ~ 0%

    return {
      profitPercent: profit,
      message: isTrending 
        ? `趋势明确，进场成功 [+${profit}%]`
        : `震荡期，小幅回撤 [${profit}%]`,
    };
  }
} 