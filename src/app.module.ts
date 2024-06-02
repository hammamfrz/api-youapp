import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ProfilesModule } from './profiles/profiles.module';
import { AuthModule } from './auth/auth.module';
import { AuthMiddleware } from '../middleware/auth.middleware';
import { JwtService } from '@nestjs/jwt';
import { PrismaClient } from '@prisma/client';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule } from '@nestjs/config';
import { RabbitmqModule } from './rabbitMQ/rabbitmq.module';
import { MessageModule } from './messages/message.module';

@Module({
  imports: [
    ProfilesModule,
    AuthModule,
    PassportModule,
    MessageModule,
    RabbitmqModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [],
  providers: [AuthMiddleware, JwtService, PrismaClient],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('/api/createProfile');
    consumer.apply(AuthMiddleware).forRoutes('/api/getProfile');
    consumer.apply(AuthMiddleware).forRoutes('/api/updateProfile');
    consumer.apply(AuthMiddleware).forRoutes('/api/sendMessage');
    consumer.apply(AuthMiddleware).forRoutes('/api/receiveMessages');
    consumer.apply(AuthMiddleware).forRoutes('/api/findNearby');
  }
}
