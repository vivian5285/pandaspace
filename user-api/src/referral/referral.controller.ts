import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Query, 
  UseGuards, 
  Request 
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ReferralService } from './referral.service';
import { BindReferralDto } from './dto/referral.dto';

@Controller('referral')
@UseGuards(AuthGuard('jwt'))
export class ReferralController {
  constructor(private referralService: ReferralService) {}

  @Post('bind')
  async bindInviteCode(
    @Request() req,
    @Body() bindReferralDto: BindReferralDto
  ) {
    await this.referralService.bindInviteCode(
      req.user.userId,
      bindReferralDto.inviteCode
    );
    return { message: 'Invite code bound successfully' };
  }

  @Get('stats')
  async getReferralStats(@Request() req) {
    return this.referralService.getReferralStats(req.user.userId);
  }

  @Get('history')
  async getReferralHistory(
    @Request() req,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10
  ) {
    return this.referralService.getReferralHistory(
      req.user.userId,
      page,
      limit
    );
  }
} 