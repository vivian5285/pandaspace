import { StrategyType, StrategyStatus } from '../schemas/strategy-record.schema';

export class CreateStrategyDto {
  strategyType: StrategyType;
}

export class UpdateStrategyStatusDto {
  status: StrategyStatus;
}

export class StrategyResponseDto {
  id: string;
  userId: string;
  strategyType: StrategyType;
  status: StrategyStatus;
  earnings: number;
  createdAt: Date;
  updatedAt: Date;
} 