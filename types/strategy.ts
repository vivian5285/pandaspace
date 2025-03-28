export interface Strategy {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'inactive';
  mode: 'simulation' | 'live';
  type: string;
  createdAt: string;
  parameters: {
    [key: string]: any;
  };
  historicalReturns: {
    date: string;
    return: number;
  }[];
}

export interface StrategyStats {
  totalReturn: number;
  monthlyReturn: number;
  successRate: number;
  runningDays: number;
}

export type StrategyMode = 'simulation' | 'live';
export type StrategyStatus = 'active' | 'inactive'; 