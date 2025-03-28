import { EarningsType } from '../schemas/earnings-record.schema';

export class EarningsSummaryDto {
  totalEarnings: number;
  todayEarnings: number;
  thirtyDaysEarnings: number;
}

export class EarningsRecordDto {
  id: string;
  amount: number;
  type: EarningsType;
  sourceStrategy?: string;
  createdAt: Date;
}

export class EarningsHistoryResponseDto {
  records: EarningsRecordDto[];
  total: number;
  page: number;
  limit: number;
} 