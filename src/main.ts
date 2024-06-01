import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  console.log('JWT_SECRET:', process.env.JWT_SECRET);
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3000);
}
bootstrap();
