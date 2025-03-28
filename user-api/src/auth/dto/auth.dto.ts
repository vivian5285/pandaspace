export class RegisterDto {
  email: string;
  password: string;
  inviteCode?: string;
}

export class LoginDto {
  email: string;
  password: string;
} 