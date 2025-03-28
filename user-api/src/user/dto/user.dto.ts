export class UpdateUserDto {
  nickname?: string;
  avatar?: string;
}

export class UserProfileResponse {
  email: string;
  nickname: string;
  avatar: string;
  myInviteCode: string;
  inviterCode: string;
  createdAt: Date;
} 