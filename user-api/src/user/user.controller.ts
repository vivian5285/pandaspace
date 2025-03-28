import { Controller, Get, Put, Body, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/user.dto';

@Controller('user')
@UseGuards(AuthGuard('jwt'))
export class UserController {
  constructor(private userService: UserService) {}

  @Get('profile')
  async getProfile(@Request() req) {
    return this.userService.getUserProfile(req.user.userId);
  }

  @Put('update')
  async updateProfile(
    @Request() req,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.updateUser(req.user.userId, updateUserDto);
  }

  @Put('bind-invite-code')
  async bindInviteCode(
    @Request() req,
    @Body('inviterCode') inviterCode: string,
  ) {
    await this.userService.bindInviteCode(req.user.userId, inviterCode);
    return { message: 'Invite code bound successfully' };
  }
} 