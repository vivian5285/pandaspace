import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type EarningsRecordDocument = EarningsRecord & Document;

export enum EarningsType {
  STRATEGY = 'strategy',
  REFERRAL = 'referral',
}

@Schema({ timestamps: true })
export class EarningsRecord {
  @Prop({ type: MongooseSchema.Types.ObjectId, required: true })
  userId: string;

  @Prop({ required: true, type: Number })
  amount: number;

  @Prop({ required: true, enum: EarningsType })
  type: EarningsType;

  @Prop()
  sourceStrategy?: string;

  @Prop({ required: true })
  createdAt: Date;
}

export const EarningsRecordSchema = SchemaFactory.createForClass(EarningsRecord);

// 创建索引以优化查询性能
EarningsRecordSchema.index({ userId: 1, createdAt: -1 }); 