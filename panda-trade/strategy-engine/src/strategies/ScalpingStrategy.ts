import { BaseStrategy } from '../core/BaseStrategy';
import { StrategyResult } from '../core/types';

export class ScalpingStrategy extends BaseStrategy {
  async run(userId: string, config: any): Promise<StrategyResult> {
    const earnings = this.generateRandomEarnings(500); // 小资金快速交易
    const percentage = this.calculatePercentage(earnings, 500);
    
    return {
      earnings,
      percentage,
      timestamp: new Date()
    };
  }
} 