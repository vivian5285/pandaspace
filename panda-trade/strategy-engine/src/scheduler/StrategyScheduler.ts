import { StrategyManager } from '../core/StrategyManager';
import { DbService } from '../services/dbService';
import mongoose from 'mongoose';

interface StrategyConfig {
  baseAmount: number;
  riskLevel: 'low' | 'medium' | 'high';
  // ...
} 

// 手动测试策略
async function testStrategy() {
  const strategy = new SuperTrendStrategy();
  const result = await strategy.run('test-user', {});
  console.log(result);
}

// 测试所有策略
async function testAllStrategies() {
  const manager = StrategyManager.getInstance();
  const types = manager.getAllStrategyTypes();
  
  for (const type of types) {
    const strategy = manager.getStrategy(type);
    const result = await strategy?.run('test-user', {});
    console.log(`${type}:`, result);
  }
} 

export class StrategyScheduler {
  private strategyManager: StrategyManager;
  private dbService: DbService;

  constructor() {
    this.strategyManager = StrategyManager.getInstance();
    this.dbService = DbService.getInstance();
  }

  async executeStrategies(): Promise<void> {
    try {
      // 获取所有启用的策略
      const enabledStrategies = await mongoose.model('Strategy').find({ 
        status: 'enabled' 
      });

      for (const strategyRecord of enabledStrategies) {
        const { userId, strategyType } = strategyRecord;
        const strategy = this.strategyManager.getStrategy(strategyType);

        if (!strategy) {
          console.error(`Unknown strategy type: ${strategyType}`);
          continue;
        }

        try {
          // 执行策略
          const result = await strategy.run(userId, {});
          
          // 记录收益
          await this.dbService.insertEarningsRecord(
            userId,
            result.profitPercent,
            strategyType
          );

          // 更新策略统计
          await this.dbService.updateStrategyStats(
            userId,
            strategyType,
            result.profitPercent
          );

          // 输出日志
          console.log(
            `[${strategyType}] User:${userId} | ${result.message} | ` +
            `Profit:${result.profitPercent}%`
          );
        } catch (error) {
          console.error(
            `Strategy execution failed for user ${userId}:`,
            error
          );
        }
      }
    } catch (error) {
      console.error('Strategy scheduler execution failed:', error);
    }
  }
} 