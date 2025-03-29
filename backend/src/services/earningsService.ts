import { PrismaClient } from '@prisma/client';
import { calculateMonthlyReturn, predictFutureEarnings } from '../utils/earningsCalculator';

const prisma = new PrismaClient();

export interface TradingProfit {
  date: string;
  profit: number;
  type: 'long' | 'short';
}

export interface MonthlyReturn {
  month: string;
  return: number;
  target: number;
}

export interface ReferralEarning {
  userId: string;
  name: string;
  earnings: number;
  date: string;
}

export interface EarningsReport {
  totalProfit: number;
  monthlyReturn: number;
  referralEarnings: number;
  tradingProfits: TradingProfit[];
  monthlyReturns: MonthlyReturn[];
  referralEarningsList: ReferralEarning[];
  prediction: {
    nextMonth: number;
    nextQuarter: number;
    nextYear: number;
  };
}

export class EarningsService {
  // 获取用户交易收益数据
  async getTradingProfits(userId: string, timeRange: 'week' | 'month' | 'year'): Promise<TradingProfit[]> {
    try {
      const startDate = this.getStartDate(timeRange);
      const profits = await prisma.tradingProfit.findMany({
        where: {
          userId,
          date: {
            gte: startDate,
          },
        },
        orderBy: {
          date: 'asc',
        },
      });
      return profits;
    } catch (error) {
      console.error('Error fetching trading profits:', error);
      throw new Error('Failed to fetch trading profits');
    }
  }

  // 计算月化收益
  async calculateMonthlyReturn(userId: string): Promise<number> {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
          tradingProfits: {
            where: {
              date: {
                gte: new Date(new Date().setMonth(new Date().getMonth() - 1)),
              },
            },
          },
        },
      });

      if (!user) {
        throw new Error('User not found');
      }

      const totalProfit = user.tradingProfits.reduce((sum, trade) => sum + trade.profit, 0);
      return calculateMonthlyReturn(totalProfit, user.initialInvestment);
    } catch (error) {
      console.error('Error calculating monthly return:', error);
      throw new Error('Failed to calculate monthly return');
    }
  }

  // 获取推荐收益
  async getReferralEarnings(userId: string): Promise<ReferralEarning[]> {
    try {
      const referrals = await prisma.referralEarning.findMany({
        where: {
          referrerId: userId,
        },
        include: {
          user: {
            select: {
              name: true,
            },
          },
        },
        orderBy: {
          date: 'desc',
        },
      });

      return referrals.map(ref => ({
        userId: ref.userId,
        name: ref.user.name,
        earnings: ref.earnings,
        date: ref.date.toISOString(),
      }));
    } catch (error) {
      console.error('Error fetching referral earnings:', error);
      throw new Error('Failed to fetch referral earnings');
    }
  }

  // 生成收益分析报告
  async generateEarningsReport(userId: string): Promise<EarningsReport> {
    try {
      const [tradingProfits, monthlyReturn, referralEarnings] = await Promise.all([
        this.getTradingProfits(userId, 'month'),
        this.calculateMonthlyReturn(userId),
        this.getReferralEarnings(userId),
      ]);

      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        throw new Error('User not found');
      }

      const totalProfit = tradingProfits.reduce((sum, trade) => sum + trade.profit, 0);
      const totalReferralEarnings = referralEarnings.reduce((sum, ref) => sum + ref.earnings, 0);

      // 生成月度收益数据
      const monthlyReturns = await this.generateMonthlyReturns(userId);

      // 预测未来收益
      const prediction = predictFutureEarnings(tradingProfits, monthlyReturn);

      return {
        totalProfit,
        monthlyReturn,
        referralEarnings: totalReferralEarnings,
        tradingProfits,
        monthlyReturns,
        referralEarningsList: referralEarnings,
        prediction,
      };
    } catch (error) {
      console.error('Error generating earnings report:', error);
      throw new Error('Failed to generate earnings report');
    }
  }

  // 导出收益数据
  async exportEarningsData(userId: string, format: 'csv' | 'excel'): Promise<string> {
    try {
      const report = await this.generateEarningsReport(userId);
      return this.formatEarningsData(report, format);
    } catch (error) {
      console.error('Error exporting earnings data:', error);
      throw new Error('Failed to export earnings data');
    }
  }

  // 私有辅助方法
  private getStartDate(timeRange: 'week' | 'month' | 'year'): Date {
    const now = new Date();
    switch (timeRange) {
      case 'week':
        return new Date(now.setDate(now.getDate() - 7));
      case 'month':
        return new Date(now.setMonth(now.getMonth() - 1));
      case 'year':
        return new Date(now.setFullYear(now.getFullYear() - 1));
      default:
        return new Date(now.setMonth(now.getMonth() - 1));
    }
  }

  private async generateMonthlyReturns(userId: string): Promise<MonthlyReturn[]> {
    const startDate = new Date(new Date().setMonth(new Date().getMonth() - 6));
    const profits = await prisma.tradingProfit.findMany({
      where: {
        userId,
        date: {
          gte: startDate,
        },
      },
      orderBy: {
        date: 'asc',
      },
    });

    // 按月份分组计算收益
    const monthlyData = profits.reduce((acc, profit) => {
      const month = new Date(profit.date).toLocaleString('zh-CN', { month: 'numeric' }) + '月';
      if (!acc[month]) {
        acc[month] = { total: 0, count: 0 };
      }
      acc[month].total += profit.profit;
      acc[month].count += 1;
      return acc;
    }, {} as Record<string, { total: number; count: number }>);

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error('User not found');
    }

    return Object.entries(monthlyData).map(([month, data]) => ({
      month,
      return: calculateMonthlyReturn(data.total, user.initialInvestment),
      target: 50, // 目标月化收益
    }));
  }

  private formatEarningsData(report: EarningsReport, format: 'csv' | 'excel'): string {
    if (format === 'csv') {
      return this.formatAsCSV(report);
    } else {
      return this.formatAsExcel(report);
    }
  }

  private formatAsCSV(report: EarningsReport): string {
    const headers = ['日期', '收益', '类型'];
    const rows = report.tradingProfits.map(profit => [
      profit.date,
      profit.profit.toString(),
      profit.type,
    ]);

    return [
      headers.join(','),
      ...rows.map(row => row.join(',')),
    ].join('\n');
  }

  private formatAsExcel(report: EarningsReport): string {
    // 这里可以使用 exceljs 等库来生成 Excel 文件
    // 为了简单起见，这里返回 CSV 格式
    return this.formatAsCSV(report);
  }
} 