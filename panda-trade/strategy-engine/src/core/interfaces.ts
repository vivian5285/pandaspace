export interface StrategyResult {
  profitPercent: number;  // 本次模拟收益（%）
  message?: string;       // 备注或日志
}

export interface StrategyRunner {
  run(userId: string, config: any): Promise<StrategyResult>;
} 