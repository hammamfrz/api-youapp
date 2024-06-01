import {
  Body,
  Controller,
  Get,
  HttpException,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/login-user.dto';
import { Request, Response } from 'express';
import { RegisterUserDto } from './dto/register-user.dto';
import { Headers } from '@nestjs/common';

@Controller('api')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/login')
  async login(@Res() response: Response, @Body() loginUserDto: LoginUserDto) {
    try {
      const result = await this.authService.loginUser(loginUserDto);
      return response.status(200).json({
        status: 'OK',
        message: 'Successfully logged in',
        data: result,
      });
    } catch (error) {
      return response.status(500).json({
        status: 'ERROR',
        message: 'Failed to log in',
        data: error,
      });
    }
  }

  @Post('/register')
  async register(
    @Req() request: Request,
    @Res() response: Response,
    @Body() registerUserDto: RegisterUserDto,
  ) {
    try {
      const result = await this.authService.registerUser(registerUserDto);
      return response.status(200).json({
        status: 'OK',
        message: 'Successfully registered',
        data: result,
      });
    } catch (error) {
      return response.status(500).json({
        status: 'ERROR',
        message: 'Failed to register',
        data: error,
      });
    }
  }

  @Get('/me')
  async getMe(@Headers('authorization') authorization: string) {
    try {
      const user = await this.authService.getMe(authorization);
      return {
        status: 'OK',
        message: 'User details retrieved successfully',
        data: user,
      };
    } catch (error) {
      throw new HttpException(
        {
          status: 'ERROR',
          message: error.message,
          data: error,
        },
        401,
      );
    }
  }
}
