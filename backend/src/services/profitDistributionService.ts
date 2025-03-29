import { PrismaClient } from '@prisma/client';
import { MonitoringService } from './monitoringService';

const prisma = new PrismaClient();
const monitoringService = new MonitoringService();

interface ProfitDistribution {
  userId: string;
  totalProfit: number;
  platformFee: number;
  leaderCommission1st: number;
  leaderCommission2nd: number;
  finalProfit: number;
}

export class ProfitDistributionService {
  // 计算收益分配
  async calculateProfitDistribution(userId: string, tradeProfit: number): Promise<ProfitDistribution> {
    try {
      // 获取用户信息
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
          referrer: true,
          referrerOf: true,
        },
      });

      if (!user) {
        throw new Error('User not found');
      }

      // 计算平台费用
      const platformFee = tradeProfit * 0.10; // 10% 平台费

      // 计算领导人佣金
      let leaderCommission1st = 0;
      let leaderCommission2nd = 0;

      if (user.referrer) {
        leaderCommission1st = tradeProfit * 0.20; // 第一代 20%
      }

      if (user.referrerOf?.referrer) {
        leaderCommission2nd = tradeProfit * 0.10; // 第二代 10%
      }

      // 计算最终收益
      const finalProfit = tradeProfit - platformFee - leaderCommission1st - leaderCommission2nd;

      // 记录收益分配
      await this.recordProfitDistribution({
        userId,
        totalProfit: tradeProfit,
        platformFee,
        leaderCommission1st,
        leaderCommission2nd,
        finalProfit,
      });

      // 记录用户活动
      await monitoringService.logUserActivity(userId, 'profit_distribution', {
        tradeProfit,
        platformFee,
        leaderCommission1st,
        leaderCommission2nd,
        finalProfit,
      });

      return {
        userId,
        totalProfit: tradeProfit,
        platformFee,
        leaderCommission1st,
        leaderCommission2nd,
        finalProfit,
      };
    } catch (error) {
      console.error('Error calculating profit distribution:', error);
      throw error;
    }
  }

  // 记录收益分配
  private async recordProfitDistribution(distribution: ProfitDistribution): Promise<void> {
    await prisma.$transaction(async (prisma) => {
      // 记录用户收益
      await prisma.tradingProfit.create({
        data: {
          userId: distribution.userId,
          profit: distribution.finalProfit,
          type: 'long',
        },
      });

      // 记录平台费用
      await prisma.platformFee.create({
        data: {
          amount: distribution.platformFee,
          type: 'trade',
        },
      });

      // 记录领导人佣金
      if (distribution.leaderCommission1st > 0) {
        await prisma.referralEarning.create({
          data: {
            referrerId: distribution.userId,
            earnings: distribution.leaderCommission1st,
            type: '1st',
          },
        });
      }

      if (distribution.leaderCommission2nd > 0) {
        await prisma.referralEarning.create({
          data: {
            referrerId: distribution.userId,
            earnings: distribution.leaderCommission2nd,
            type: '2nd',
          },
        });
      }
    });
  }

  // 获取用户收益统计
  async getUserProfitStats(userId: string): Promise<any> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        tradingProfits: true,
        referralEarnings: true,
      },
    });

    if (!user) {
      throw new Error('User not found');
    }

    const totalTradingProfit = user.tradingProfits.reduce((sum, profit) => sum + profit.profit, 0);
    const totalReferralEarnings = user.referralEarnings.reduce(
      (sum, earning) => sum + earning.earnings,
      0
    );

    return {
      userId,
      totalTradingProfit,
      totalReferralEarnings,
      totalEarnings: totalTradingProfit + totalReferralEarnings,
      monthlyReturn: this.calculateMonthlyReturn(totalTradingProfit, user.initialInvestment),
    };
  }

  // 计算月化收益
  private calculateMonthlyReturn(totalProfit: number, initialInvestment: number): number {
    if (initialInvestment <= 0) return 0;
    return (totalProfit / initialInvestment) * 100;
  }

  // 获取平台收益统计
  async getPlatformProfitStats(): Promise<any> {
    const platformFees = await prisma.platformFee.findMany();
    const totalPlatformFees = platformFees.reduce((sum, fee) => sum + fee.amount, 0);

    const referralEarnings = await prisma.referralEarning.findMany();
    const totalReferralEarnings = referralEarnings.reduce(
      (sum, earning) => sum + earning.earnings,
      0
    );

    return {
      totalPlatformFees,
      totalReferralEarnings,
      totalRevenue: totalPlatformFees + totalReferralEarnings,
    };
  }
} 