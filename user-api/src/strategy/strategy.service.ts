import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { 
  StrategyRecord, 
  StrategyRecordDocument,
  StrategyType,
  StrategyStatus 
} from './schemas/strategy-record.schema';
import { CreateStrategyDto, StrategyResponseDto } from './dto/strategy.dto';
import { ReferralService } from '../referral/referral.service';
import { EarningsService } from '../earnings/earnings.service';

@Injectable()
export class StrategyService {
  constructor(
    @InjectModel(StrategyRecord.name)
    private strategyRecordModel: Model<StrategyRecordDocument>,
    private referralService: ReferralService,
    private earningsService: EarningsService,
  ) {}

  async getAllStrategies(userId: string): Promise<StrategyResponseDto[]> {
    const strategies = await this.strategyRecordModel
      .find({ userId })
      .sort({ createdAt: -1 })
      .exec();

    return strategies.map(strategy => this.toResponseDto(strategy));
  }

  async getStrategy(userId: string, strategyId: string): Promise<StrategyResponseDto> {
    const strategy = await this.strategyRecordModel
      .findOne({ _id: strategyId, userId })
      .exec();

    if (!strategy) {
      throw new NotFoundException('Strategy not found');
    }

    return this.toResponseDto(strategy);
  }

  async createStrategy(userId: string, createStrategyDto: CreateStrategyDto): Promise<StrategyResponseDto> {
    try {
      const strategy = new this.strategyRecordModel({
        userId,
        strategyType: createStrategyDto.strategyType,
        status: StrategyStatus.DISABLED,
        earnings: 0,
      });

      const savedStrategy = await strategy.save();
      return this.toResponseDto(savedStrategy);
    } catch (error) {
      if (error.code === 11000) { // MongoDB duplicate key error
        throw new ConflictException('Strategy already exists for this user');
      }
      throw error;
    }
  }

  async updateStrategyStatus(
    userId: string,
    strategyId: string,
    status: StrategyStatus,
  ): Promise<StrategyResponseDto> {
    const strategy = await this.strategyRecordModel
      .findOneAndUpdate(
        { _id: strategyId, userId },
        { status },
        { new: true }
      )
      .exec();

    if (!strategy) {
      throw new NotFoundException('Strategy not found');
    }

    return this.toResponseDto(strategy);
  }

  async settleStrategyEarnings(userId: string, earnings: number) {
    // 1. 记录策略收益
    await this.earningsService.createEarningsRecord(
      userId,
      earnings,
      'strategy'
    );

    // 2. 计算并分发推广收益
    const referralChain = await this.referralService.getReferralChain(userId);
    if (referralChain.length > 0) {
      // 一级推广获得 10%
      await this.referralService.recordReferralEarning(
        referralChain[0],
        userId,
        earnings * 0.1
      );

      // 二级推广获得 5%
      if (referralChain[1]) {
        await this.referralService.recordReferralEarning(
          referralChain[1],
          userId,
          earnings * 0.05
        );
      }
    }
  }

  private toResponseDto(strategy: StrategyRecordDocument): StrategyResponseDto {
    return {
      id: strategy._id.toString(),
      userId: strategy.userId,
      strategyType: strategy.strategyType,
      status: strategy.status,
      earnings: strategy.earnings,
      createdAt: strategy.createdAt,
      updatedAt: strategy.updatedAt,
    };
  }
} 