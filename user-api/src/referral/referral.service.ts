import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../auth/schemas/user.schema';
import { EarningsRecord } from '../earnings/schemas/earnings-record.schema';

@Injectable()
export class ReferralService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(EarningsRecord.name) private earningsModel: Model<EarningsRecord>,
  ) {}

  async bindInviteCode(userId: string, inviteCode: string): Promise<void> {
    // 查找当前用户
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // 检查是否已绑定邀请码
    if (user.inviterCode) {
      throw new BadRequestException('Already bound to an inviter');
    }

    // 查找邀请人
    const inviter = await this.userModel.findOne({ myInviteCode: inviteCode });
    if (!inviter) {
      throw new BadRequestException('Invalid invite code');
    }

    // 防止自己邀请自己
    if (inviter.id === userId) {
      throw new BadRequestException('Cannot bind your own invite code');
    }

    // 更新用户的邀请人代码
    await this.userModel.findByIdAndUpdate(userId, {
      inviterCode: inviteCode
    });
  }

  async getReferralStats(userId: string): Promise<ReferralStatsDto> {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // 查找一级下线
    const level1Users = await this.userModel.find({ 
      inviterCode: user.myInviteCode 
    });
    
    // 查找二级下线
    const level1InviteCodes = level1Users.map(u => u.myInviteCode);
    const level2Count = await this.userModel.countDocuments({
      inviterCode: { $in: level1InviteCodes }
    });

    // 计算总收益
    const totalEarnings = await this.earningsModel.aggregate([
      {
        $match: {
          userId,
          type: 'referral'
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' }
        }
      }
    ]);

    return {
      level1Count: level1Users.length,
      level2Count,
      totalEarnings: totalEarnings[0]?.total || 0
    };
  }

  async getReferralHistory(
    userId: string,
    page: number = 1,
    limit: number = 10
  ) {
    const skip = (page - 1) * limit;

    // 获取推广收益记录
    const [records, total] = await Promise.all([
      this.earningsModel
        .find({
          userId,
          type: 'referral'
        })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('refUserId', 'email')  // 关联查询用户邮箱
        .exec(),

      this.earningsModel.countDocuments({
        userId,
        type: 'referral'
      })
    ]);

    const formattedRecords = records.map(record => ({
      id: record._id.toString(),
      amount: record.amount,
      refUserId: record.refUserId,
      refUserEmail: record.refUserId.email,
      createdAt: record.createdAt
    }));

    return {
      records: formattedRecords,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  // 辅助方法：记录推广收益
  async recordReferralEarning(
    userId: string,
    refUserId: string,
    amount: number
  ): Promise<void> {
    await this.earningsModel.create({
      userId,
      refUserId,
      type: 'referral',
      amount,
      createdAt: new Date()
    });
  }

  // 辅助方法：获取用户的邀请链（用于分润）
  async getReferralChain(userId: string): Promise<string[]> {
    const user = await this.userModel.findById(userId);
    if (!user || !user.inviterCode) {
      return [];
    }

    const level1Inviter = await this.userModel.findOne({ 
      myInviteCode: user.inviterCode 
    });
    if (!level1Inviter) {
      return [];
    }

    const chain = [level1Inviter.id];

    if (level1Inviter.inviterCode) {
      const level2Inviter = await this.userModel.findOne({ 
        myInviteCode: level1Inviter.inviterCode 
      });
      if (level2Inviter) {
        chain.push(level2Inviter.id);
      }
    }

    return chain;
  }
} 