import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../auth/schemas/user.schema';
import { UpdateUserDto, UserProfileResponse } from './dto/user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async getUserProfile(userId: string): Promise<UserProfileResponse> {
    const user = await this.userModel.findById(userId).exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return {
      email: user.email,
      nickname: user.nickname,
      avatar: user.avatar,
      myInviteCode: user.myInviteCode,
      inviterCode: user.inviterCode,
      createdAt: user.createdAt,
    };
  }

  async updateUser(userId: string, updateUserDto: UpdateUserDto): Promise<UserProfileResponse> {
    const user = await this.userModel
      .findByIdAndUpdate(
        userId,
        { $set: updateUserDto },
        { new: true }
      )
      .exec();

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return {
      email: user.email,
      nickname: user.nickname,
      avatar: user.avatar,
      myInviteCode: user.myInviteCode,
      inviterCode: user.inviterCode,
      createdAt: user.createdAt,
    };
  }

  async bindInviteCode(userId: string, inviterCode: string): Promise<void> {
    // 查找邀请人
    const inviter = await this.userModel.findOne({ myInviteCode: inviterCode }).exec();
    if (!inviter) {
      throw new NotFoundException('Invalid invite code');
    }

    // 更新当前用户的邀请人代码
    const user = await this.userModel.findById(userId).exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.inviterCode) {
      throw new Error('Invite code already bound');
    }

    user.inviterCode = inviterCode;
    await user.save();
  }
} 