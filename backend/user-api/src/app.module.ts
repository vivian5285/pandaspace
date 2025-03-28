import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { StrategyModule } from './strategy/strategy.module';
import { ReferralModule } from './referral/referral.module';
import { EarningsModule } from './earnings/earnings.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(
      process.env.MONGO_URI || 'mongodb://localhost:27017/pandaquant'
    ),
    UserModule,
    AuthModule,
    StrategyModule,
    ReferralModule,
    EarningsModule,
  ],
})
export class AppModule {} 