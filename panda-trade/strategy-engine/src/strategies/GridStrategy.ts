import { BaseStrategy } from '../core/BaseStrategy';
import { StrategyResult } from '../core/types';

export class GridStrategy extends BaseStrategy {
  async run(userId: string, config: any): Promise<StrategyResult> {
    const earnings = this.generateRandomEarnings(2000); // 网格策略通常资金量较大
    const percentage = this.calculatePercentage(earnings, 2000);
    
    return {
      earnings,
      percentage,
      timestamp: new Date()
    };
  }
} 