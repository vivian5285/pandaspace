import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User, UserDocument } from './schemas/user.schema';
import { RegisterDto, LoginDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto): Promise<any> {
    const { email, password, inviteCode } = registerDto;
    
    // Check if user already exists
    const existingUser = await this.userModel.findOne({ email }).exec();
    if (existingUser) {
      throw new UnauthorizedException('User already exists');
    }

    // Generate unique invite code
    const myInviteCode = await this.generateUniqueInviteCode();

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new this.userModel({
      email,
      password: hashedPassword,
      myInviteCode,
      inviterCode: inviteCode || '',
    });

    await newUser.save();

    return {
      message: 'User registered successfully',
    };
  }

  private async generateUniqueInviteCode(): Promise<string> {
    const length = 8;
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let inviteCode: string;
    
    do {
      inviteCode = Array.from(
        { length },
        () => characters[Math.floor(Math.random() * characters.length)]
      ).join('');
    } while (await this.userModel.findOne({ myInviteCode: inviteCode }).exec());

    return inviteCode;
  }

  async login(loginDto: LoginDto): Promise<any> {
    const { email, password } = loginDto;
    
    // Find user
    const user = await this.userModel.findOne({ email }).exec();
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate JWT
    const payload = { userId: user._id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
} 