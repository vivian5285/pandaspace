import { Controller, Get, Query, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { EarningsService } from './earnings.service';

@Controller('earnings')
@UseGuards(AuthGuard('jwt'))
export class EarningsController {
  constructor(private earningsService: EarningsService) {}

  @Get('summary')
  async getEarningsSummary(@Request() req) {
    return this.earningsService.getEarningsSummary(req.user.userId);
  }

  @Get('history')
  async getEarningsHistory(
    @Request() req,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return this.earningsService.getEarningsHistory(
      req.user.userId,
      page,
      limit
    );
  }
} 