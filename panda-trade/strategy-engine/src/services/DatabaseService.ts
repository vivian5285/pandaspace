import mongoose from 'mongoose';
import { StrategyRecord } from '../core/types';

export class DatabaseService {
  private strategyModel: mongoose.Model<StrategyRecord>;
  private earningsModel: mongoose.Model<any>;

  constructor() {
    // 定义 Strategy 模型
    const strategySchema = new mongoose.Schema({
      userId: String,
      strategyType: String,
      status: String,
      earnings: Number,
      createdAt: Date,
      updatedAt: Date
    });

    // 定义 Earnings 模型
    const earningsSchema = new mongoose.Schema({
      userId: String,
      amount: Number,
      type: String,
      sourceStrategy: String,
      createdAt: Date
    });

    this.strategyModel = mongoose.model<StrategyRecord>('Strategy', strategySchema);
    this.earningsModel = mongoose.model('Earnings', earningsSchema);
  }

  async connect(): Promise<void> {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/panda-trade');
    console.log('Connected to MongoDB');
  }

  async getEnabledStrategies(): Promise<StrategyRecord[]> {
    return this.strategyModel.find({ status: 'enabled' }).exec();
  }

  async recordEarnings(
    userId: string,
    amount: number,
    strategyType: string
  ): Promise<void> {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // 记录收益明细
      await this.earningsModel.create([{
        userId,
        amount,
        type: 'strategy',
        sourceStrategy: strategyType,
        createdAt: new Date()
      }], { session });

      // 更新策略总收益
      await this.strategyModel.updateOne(
        { userId, strategyType },
        { 
          $inc: { earnings: amount },
          $set: { lastRunAt: new Date() }
        }
      ).session(session);

      await session.commitTransaction();
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }
} 