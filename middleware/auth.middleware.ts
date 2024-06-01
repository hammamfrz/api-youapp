// auth.middleware.ts
import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { JwtService } from '@nestjs/jwt';
import { PrismaClient, User } from '@prisma/client';
import { ConfigService } from '@nestjs/config';

export interface RequestWithUser extends Request {
  user: User;
}

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaClient,
    private readonly configService: ConfigService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.replace('Bearer ', '');

    if (!token) {
      throw new UnauthorizedException('No token provided');
    }

    try {
      const secret = this.configService.get<string>('JWT_SECRET');
      const decodedToken = this.jwtService.verify(token, { secret });

      const user = await this.prisma.user.findFirst({
        where: {
          id: decodedToken.id,
        },
      });

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      (req as RequestWithUser).user = user;
      next();
    } catch (error) {
      throw new UnauthorizedException('Unauthorized');
    }
  }
}
