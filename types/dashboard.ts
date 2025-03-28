export interface EarningsSummary {
  todayEarnings: number;
  monthEarnings: number;
  totalEarnings: number;
}

export interface Strategy {
  id: string;
  name: string;
  status: 'active' | 'inactive';
  returnRate: number;
} 