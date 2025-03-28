import mongoose, { Schema } from 'mongoose';
import { DailyEarningsSummary } from '../types/daily-summary';

const DailySummarySchema = new Schema({
  userId: { type: String, required: true },
  userEmail: String,
  totalEarnings: Number,
  tradeCount: Number,
  bestStrategy: String,
  bestStrategyEarnings: Number,
  date: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now }
});

// 创建复合索引
DailySummarySchema.index({ userId: 1, date: 1 }, { unique: true });
DailySummarySchema.index({ date: 1, totalEarnings: -1 }); // 用于排行榜查询

export const DailySummaryModel = mongoose.model('DailySummary', DailySummarySchema); 