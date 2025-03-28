import mongoose, { Document, Schema } from 'mongoose';

export interface Earnings {
  userId: string;
  amount: number;
  type: 'strategy' | 'referral';
  sourceStrategy?: string;
  createdAt: Date;
}

export interface EarningsDocument extends Earnings, Document {}

const EarningsSchema = new Schema({
  userId: { 
    type: String, 
    required: true,
    index: true 
  },
  amount: { 
    type: Number, 
    required: true 
  },
  type: { 
    type: String, 
    enum: ['strategy', 'referral'], 
    required: true 
  },
  sourceStrategy: { 
    type: String 
  },
  createdAt: { 
    type: Date, 
    default: Date.now,
    index: true 
  }
});

export const EarningsModel = mongoose.model<EarningsDocument>('Earnings', EarningsSchema); 