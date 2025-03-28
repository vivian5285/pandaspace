import cron from 'node-cron';
import { DbService } from '../services/dbService';
import { DailyEarningsSummary, StrategyEarningsSummary } from '../types/daily-summary';

export class DailyTaskScheduler {
  private dbService: DbService;

  constructor() {
    this.dbService = DbService.getInstance();
    this.initializeCronJobs();
  }

  private initializeCronJobs() {
    // 每天 00:00 执行
    cron.schedule('0 0 * * *', () => {
      this.runDailySummary().catch(err => {
        console.error('Daily summary task failed:', err);
      });
    });

    // 可选：每天 00:05 执行排行榜统计
    cron.schedule('5 0 * * *', () => {
      this.generateDailyLeaderboard().catch(err => {
        console.error('Leaderboard generation failed:', err);
      });
    });
  }

  async runDailySummary(): Promise<void> {
    console.log('Starting daily earnings summary...');
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(0, 0, 0, 0);

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    try {
      // 获取昨日所有策略收益记录
      const dailyEarnings = await this.dbService.aggregateEarnings([
        {
          $match: {
            type: 'strategy',
            createdAt: {
              $gte: yesterday,
              $lt: todayStart
            }
          }
        },
        {
          $group: {
            _id: {
              userId: '$userId',
              strategyType: '$sourceStrategy'
            },
            totalEarnings: { $sum: '$amount' },
            tradeCount: { $count: {} }
          }
        },
        {
          $group: {
            _id: '$_id.userId',
            strategies: {
              $push: {
                strategyType: '$_id.strategyType',
                totalEarnings: '$totalEarnings',
                tradeCount: '$tradeCount'
              }
            },
            totalDailyEarnings: { $sum: '$totalEarnings' },
            totalTradeCount: { $sum: '$tradeCount' }
          }
        }
      ]);

      // 处理每个用户的汇总数据
      for (const userSummary of dailyEarnings) {
        const userId = userSummary._id;
        const strategies: StrategyEarningsSummary[] = userSummary.strategies;
        
        // 找出表现最好的策略
        const bestStrategy = strategies.reduce((prev, curr) => 
          curr.totalEarnings > prev.totalEarnings ? curr : prev
        );

        // 创建日报汇总
        const summary: DailyEarningsSummary = {
          userId,
          totalEarnings: userSummary.totalDailyEarnings,
          tradeCount: userSummary.totalTradeCount,
          bestStrategy: bestStrategy.strategyType,
          bestStrategyEarnings: bestStrategy.totalEarnings,
          date: yesterday
        };

        // 保存日报汇总
        await this.saveDailySummary(summary);

        // 输出日志
        console.log(
          `[Daily Summary] User:${userId} | ` +
          `Total:${summary.totalEarnings.toFixed(2)}% | ` +
          `Trades:${summary.tradeCount} | ` +
          `Best:${summary.bestStrategy} (${bestStrategy.totalEarnings.toFixed(2)}%)`
        );
      }

      console.log('Daily summary completed successfully');
    } catch (error) {
      console.error('Error in daily summary task:', error);
      throw error;
    }
  }

  private async saveDailySummary(summary: DailyEarningsSummary): Promise<void> {
    // 保存到 daily_summaries 集合
    await this.dbService.insertDailySummary(summary);

    // 可选：发送邮件通知
    if (summary.totalEarnings > 5) { // 收益超过5%时发送通知
      await this.sendEarningsNotification(summary);
    }
  }

  private async generateDailyLeaderboard(): Promise<void> {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(0, 0, 0, 0);

    try {
      // 获取昨日收益排行榜
      const leaderboard = await this.dbService.aggregateEarnings([
        {
          $match: {
            type: 'strategy',
            createdAt: {
              $gte: yesterday,
              $lt: new Date()
            }
          }
        },
        {
          $group: {
            _id: '$userId',
            totalEarnings: { $sum: '$amount' },
            tradeCount: { $count: {} }
          }
        },
        {
          $sort: { totalEarnings: -1 }
        },
        {
          $limit: 10
        }
      ]);

      // 保存排行榜数据
      await this.dbService.saveDailyLeaderboard(yesterday, leaderboard);

      console.log('Daily leaderboard generated successfully');
    } catch (error) {
      console.error('Error generating leaderboard:', error);
      throw error;
    }
  }

  private async sendEarningsNotification(summary: DailyEarningsSummary): Promise<void> {
    // 这里可以实现邮件通知逻辑
    console.log(`Would send notification for user ${summary.userId} - High earnings!`);
  }
} 