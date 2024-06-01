import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { LoginUserDto } from './dto/login-user.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaClient,
    private jwtService: JwtService,
  ) {}

  async loginUser(loginUserDto: LoginUserDto) {
    const { username, email, password } = loginUserDto;
    const user = await this.prisma.user.findFirst({
      where: {
        OR: [
          {
            username,
          },
          {
            email,
          },
        ],
      },
      include: {
        profile: true,
      },
    });
    if (!user) {
      throw new Error('Invalid credentials');
    }
    const validatePassword = await bcrypt.compare(password, user.password);
    if (!validatePassword) {
      throw new Error('Invalid credentials');
    }
    const payload = {
      username: user.username,
      email: user.email,
      id: user.id,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async registerUser(registerUserDto: RegisterUserDto) {
    const { username, email, password } = registerUserDto;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    await this.prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },
    });
    return {
      access_token: this.jwtService.sign({ username, email }),
    };
  }

  async getMe(authorization: string) {
    if (!authorization) {
      throw new UnauthorizedException('Authorization header is missing');
    }

    const token = authorization.replace('Bearer ', '');
    const decodedToken = this.jwtService.verify(token);
    const userId = decodedToken.id;
    const user = await this.prisma.user.findFirst({
      where: {
        id: userId,
      },
      include: {
        profile: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return user;
  }
}
