import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { 
  EarningsRecord, 
  EarningsRecordDocument 
} from './schemas/earnings-record.schema';
import { 
  EarningsSummaryDto, 
  EarningsHistoryResponseDto 
} from './dto/earnings.dto';

@Injectable()
export class EarningsService {
  constructor(
    @InjectModel(EarningsRecord.name)
    private earningsRecordModel: Model<EarningsRecordDocument>,
  ) {}

  async getEarningsSummary(userId: string): Promise<EarningsSummaryDto> {
    const now = new Date();
    const todayStart = new Date(now.setHours(0, 0, 0, 0));
    const thirtyDaysAgo = new Date(now.setDate(now.getDate() - 30));

    // 获取总收益
    const totalEarnings = await this.earningsRecordModel.aggregate([
      { $match: { userId: userId } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    // 获取今日收益
    const todayEarnings = await this.earningsRecordModel.aggregate([
      { 
        $match: { 
          userId: userId,
          createdAt: { $gte: todayStart }
        }
      },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    // 获取近30天收益
    const thirtyDaysEarnings = await this.earningsRecordModel.aggregate([
      { 
        $match: { 
          userId: userId,
          createdAt: { $gte: thirtyDaysAgo }
        }
      },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    return {
      totalEarnings: totalEarnings[0]?.total || 0,
      todayEarnings: todayEarnings[0]?.total || 0,
      thirtyDaysEarnings: thirtyDaysEarnings[0]?.total || 0,
    };
  }

  async getEarningsHistory(
    userId: string,
    page: number = 1,
    limit: number = 10
  ): Promise<EarningsHistoryResponseDto> {
    const skip = (page - 1) * limit;

    const [records, total] = await Promise.all([
      this.earningsRecordModel
        .find({ userId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.earningsRecordModel.countDocuments({ userId })
    ]);

    return {
      records: records.map(record => ({
        id: record._id.toString(),
        amount: record.amount,
        type: record.type,
        sourceStrategy: record.sourceStrategy,
        createdAt: record.createdAt,
      })),
      total,
      page,
      limit,
    };
  }

  // 用于其他模块记录收益的辅助方法
  async recordEarnings(
    userId: string,
    amount: number,
    type: string,
    sourceStrategy?: string
  ): Promise<EarningsRecordDocument> {
    const record = new this.earningsRecordModel({
      userId,
      amount,
      type,
      sourceStrategy,
      createdAt: new Date(),
    });

    return record.save();
  }
} 