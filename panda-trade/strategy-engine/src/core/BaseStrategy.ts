import { StrategyRunner, StrategyResult } from './types';

export abstract class BaseStrategy implements StrategyRunner {
  protected generateRandomEarnings(baseAmount: number = 1000): number {
    // 生成-1%到+1%之间的随机收益
    const percentage = (Math.random() * 2 - 1) * 0.01;
    return baseAmount * percentage;
  }

  protected calculatePercentage(earnings: number, baseAmount: number = 1000): number {
    return (earnings / baseAmount) * 100;
  }

  abstract run(userId: string, config: any): Promise<StrategyResult>;
} 