import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  constructor() {}

  async validateUser(username: string, password: string) {
    // TODO: 实现用户验证逻辑
    return null;
  }

  async login(user: any) {
    // TODO: 实现登录逻辑
    return null;
  }
} 