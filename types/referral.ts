export interface UserProfile {
  myInviteCode: string;
  username: string;
}

export interface ReferralStats {
  level1Count: number;
  level2Count: number;
  totalEarnings: number;
}

export interface ReferralRecord {
  id: string;
  sourceUser: string;
  amount: number;
  timestamp: string;
  level: 1 | 2;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
} 