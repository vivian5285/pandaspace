import mongoose from 'mongoose';
import { EarningsModel, Earnings } from '../models/earnings.model';
import { DailyEarningsSummary } from '../types/daily-summary';

export class DbService {
  private static instance: DbService;
  private isConnected: boolean = false;

  private constructor() {}

  static getInstance(): DbService {
    if (!DbService.instance) {
      DbService.instance = new DbService();
    }
    return DbService.instance;
  }

  async connect(): Promise<void> {
    if (this.isConnected) return;

    try {
      await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/panda-trade');
      this.isConnected = true;
      console.log('Successfully connected to MongoDB');
    } catch (error) {
      console.error('MongoDB connection error:', error);
      throw error;
    }
  }

  async insertEarningsRecord(
    userId: string,
    amount: number,
    strategyType: string
  ): Promise<void> {
    try {
      const record: Earnings = {
        userId,
        amount,
        type: 'strategy',
        sourceStrategy: strategyType,
        createdAt: new Date()
      };

      await EarningsModel.create(record);
      
      console.log(`Earnings record inserted for user ${userId}: ${amount}%`);
    } catch (error) {
      console.error('Failed to insert earnings record:', error);
      throw error;
    }
  }

  async updateStrategyStats(
    userId: string,
    strategyType: string,
    amount: number
  ): Promise<void> {
    try {
      await mongoose.model('Strategy').updateOne(
        { userId, strategyType },
        { 
          $inc: { totalEarnings: amount },
          $set: { lastRunAt: new Date() }
        }
      );
    } catch (error) {
      console.error('Failed to update strategy stats:', error);
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    if (this.isConnected) {
      await mongoose.disconnect();
      this.isConnected = false;
      console.log('Disconnected from MongoDB');
    }
  }

  async aggregateEarnings(pipeline: any[]): Promise<any[]> {
    return await this.earningsModel.aggregate(pipeline);
  }

  async insertDailySummary(summary: DailyEarningsSummary): Promise<void> {
    await mongoose.model('DailySummary').create(summary);
  }

  async saveDailyLeaderboard(date: Date, leaderboard: any[]): Promise<void> {
    await mongoose.model('DailyLeaderboard').create({
      date,
      rankings: leaderboard
    });
  }
} 