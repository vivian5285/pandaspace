import { DbService } from './services/dbService';
import { StrategyScheduler } from './scheduler/StrategyScheduler';
import { DailyTaskScheduler } from './scheduler/dailyTask';

async function main() {
  try {
    // 连接数据库
    const dbService = DbService.getInstance();
    await dbService.connect();

    // 初始化策略调度器
    const scheduler = new StrategyScheduler();

    // 初始化每日任务调度器
    const dailyTaskScheduler = new DailyTaskScheduler();

    // 每分钟执行一次策略
    setInterval(() => {
      scheduler.executeStrategies().catch(console.error);
    }, 60 * 1000);

    // 如果需要立即执行一次昨日统计（例如服务重启时）
    if (process.env.RUN_DAILY_SUMMARY_ON_START === 'true') {
      await dailyTaskScheduler.runDailySummary();
    }

    // 立即执行一次
    await scheduler.executeStrategies();

    console.log('Strategy engine started successfully');

    // 优雅退出
    process.on('SIGTERM', async () => {
      console.log('Received SIGTERM. Performing graceful shutdown...');
      await dbService.disconnect();
      process.exit(0);
    });

  } catch (error) {
    console.error('Failed to start strategy engine:', error);
    process.exit(1);
  }
}

main(); 