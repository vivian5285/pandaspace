export interface DailyEarningsSummary {
  userId: string;
  userEmail?: string;
  totalEarnings: number;
  tradeCount: number;
  bestStrategy: string;
  bestStrategyEarnings: number;
  date: Date;
}

export interface StrategyEarningsSummary {
  strategyType: string;
  totalEarnings: number;
  tradeCount: number;
} 