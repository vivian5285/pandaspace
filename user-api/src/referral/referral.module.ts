import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ReferralController } from './referral.controller';
import { ReferralService } from './referral.service';
import { User, UserSchema } from '../auth/schemas/user.schema';
import { EarningsRecord, EarningsRecordSchema } from '../earnings/schemas/earnings-record.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: EarningsRecord.name, schema: EarningsRecordSchema }
    ]),
  ],
  controllers: [ReferralController],
  providers: [ReferralService],
  exports: [ReferralService],
})
export class ReferralModule {} 