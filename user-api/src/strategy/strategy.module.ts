import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { StrategyController } from './strategy.controller';
import { StrategyService } from './strategy.service';
import { 
  StrategyRecord, 
  StrategyRecordSchema 
} from './schemas/strategy-record.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: StrategyRecord.name, schema: StrategyRecordSchema }
    ]),
  ],
  controllers: [StrategyController],
  providers: [StrategyService],
  exports: [StrategyService],
})
export class StrategyModule {} 