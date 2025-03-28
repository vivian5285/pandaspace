import { BaseStrategy } from '../core/BaseStrategy';
import { StrategyResult } from '../core/types';

export class SuperTrendStrategy extends BaseStrategy {
  async run(userId: string, config: any): Promise<StrategyResult> {
    const earnings = this.generateRandomEarnings();
    const percentage = this.calculatePercentage(earnings);
    
    return {
      earnings,
      percentage,
      timestamp: new Date()
    };
  }
} 