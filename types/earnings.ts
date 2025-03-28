export interface EarningRecord {
  id: string;
  amount: number;
  type: 'strategy' | 'referral';
  strategyName?: string;
  sourceUser?: string;
  timestamp: string;
}

export interface DailyEarnings {
  date: string;
  amount: number;
} 