import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type StrategyRecordDocument = StrategyRecord & Document;

export enum StrategyType {
  SUPER_TREND = 'super-trend',
  SCALPING = 'scalping',
  GRID = 'grid',
}

export enum StrategyStatus {
  ENABLED = 'enabled',
  DISABLED = 'disabled',
}

@Schema({ timestamps: true })
export class StrategyRecord {
  @Prop({ type: MongooseSchema.Types.ObjectId, required: true })
  userId: string;

  @Prop({ required: true, enum: StrategyType })
  strategyType: StrategyType;

  @Prop({ required: true, enum: StrategyStatus, default: StrategyStatus.DISABLED })
  status: StrategyStatus;

  @Prop({ default: 0 })
  earnings: number;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export const StrategyRecordSchema = SchemaFactory.createForClass(StrategyRecord);

// 创建复合索引确保用户不能重复开启同一策略
StrategyRecordSchema.index({ userId: 1, strategyType: 1 }, { unique: true }); 