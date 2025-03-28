export interface StrategyResult {
  earnings: number;
  percentage: number;
  timestamp: Date;
}

export interface StrategyRunner {
  run(userId: string, config: any): Promise<StrategyResult>;
}

export interface StrategyRecord {
  _id: string;
  userId: string;
  strategyType: string;
  status: string;
  earnings: number;
  createdAt: Date;
  updatedAt: Date;
} 