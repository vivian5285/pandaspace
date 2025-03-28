export class BindReferralDto {
  inviteCode: string;
}

export class ReferralStatsDto {
  level1Count: number;
  level2Count: number;
  totalEarnings: number;
}

export class ReferralHistoryDto {
  id: string;
  amount: number;
  refUserId: string;
  refUserEmail: string;  // 被推广用户的邮箱
  createdAt: Date;
} 