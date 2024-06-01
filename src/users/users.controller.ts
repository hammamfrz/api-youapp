import { UsersService } from './users.service';
import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { CreateProfileDto } from './dto/create-profile.dto';
import { RequestWithUser } from '../../middleware/auth.middleware';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Controller()
export class UsersController {
  constructor(private usersService: UsersService) {}
  @Get()
  async getAllUsers(@Req() request: Request, @Res() response: Response) {
    try {
      const result = await this.usersService.getAllUsers();
      return response.status(200).json({
        status: 'OK',
        message: 'Successfully fetched all users',
        data: result,
      });
    } catch (error) {
      return response.status(500).json({
        status: 'ERROR',
        message: 'Failed to fetch all users',
        data: error,
      });
    }
  }

  @Post('/api/createProfile')
  async createProfile(
    @Req() request: RequestWithUser,
    @Res() response: Response,
    @Body() createProfileDto: CreateProfileDto,
  ) {
    try {
      const { id } = request.user;
      const result = await this.usersService.createProfile(
        createProfileDto,
        id,
      );
      return response.status(200).json({
        status: 'OK',
        message: 'Successfully created profile',
        data: result,
      });
    } catch (error) {
      return response.status(500).json({
        status: 'ERROR',
        message: 'Failed to create profile',
        data: error,
      });
    }
  }

  @Get('/api/getProfile')
  async getProfile(@Req() request: RequestWithUser, @Res() response: Response) {
    try {
      const { id } = request.user;
      const result = await this.usersService.getProfile(id);
      return response.status(200).json({
        status: 'OK',
        message: 'Successfully fetched profile',
        data: result,
      });
    } catch (error) {
      return response.status(500).json({
        status: 'ERROR',
        message: 'Failed to fetch profile',
        data: error,
      });
    }
  }

  @Post('/api/updateProfile')
  async updateProfile(
    @Req() request: RequestWithUser,
    @Res() response: Response,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    try {
      const { id } = request.user;
      const result = await this.usersService.updateProfile(
        id,
        updateProfileDto,
      );
      return response.status(200).json({
        status: 'OK',
        message: 'Successfully updated profile',
        data: result,
      });
    } catch (error) {
      return response.status(500).json({
        status: 'ERROR',
        message: 'Failed to update profile',
        data: error,
      });
    }
  }
}
