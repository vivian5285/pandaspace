import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { StrategyModule } from './strategy/strategy.module';
import { EarningsModule } from './earnings/earnings.module';
import { ReferralModule } from './referral/referral.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(
      process.env.MONGO_URI || 'mongodb://localhost:27017/pandaquant'
    ),
    AuthModule,
    UserModule,
    StrategyModule,
    EarningsModule,
    ReferralModule,
  ],
})
export class AppModule {} 