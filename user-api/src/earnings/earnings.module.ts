import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EarningsController } from './earnings.controller';
import { EarningsService } from './earnings.service';
import { 
  EarningsRecord, 
  EarningsRecordSchema 
} from './schemas/earnings-record.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: EarningsRecord.name, schema: EarningsRecordSchema }
    ]),
  ],
  controllers: [EarningsController],
  providers: [EarningsService],
  exports: [EarningsService], // 导出服务供其他模块使用
})
export class EarningsModule {} 