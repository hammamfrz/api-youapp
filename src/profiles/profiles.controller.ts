import { ProfilesService } from './profiles.service';
import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { CreateProfileDto } from './dto/create-profile.dto';
import { RequestWithUser } from '../../middleware/auth.middleware';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Controller()
export class ProfilesController {
  constructor(private profilesService: ProfilesService) {}
  @Get()
  async getAllUsers(@Req() request: Request, @Res() response: Response) {
    try {
      const result = await this.profilesService.getAllUsers();
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
      const result = await this.profilesService.createProfile(
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

  private getClientIp(request: Request): string {
    const xForwardedFor = request.headers['x-forwarded-for'];
    if (typeof xForwardedFor === 'string') {
      return xForwardedFor.split(',')[0].trim();
    } else if (Array.isArray(xForwardedFor)) {
      return xForwardedFor[0];
    }
    return request.connection.remoteAddress || request.ip;
  }

  @Get('/api/getProfile')
  async getProfile(@Req() request: RequestWithUser, @Res() response: Response) {
    try {
      const { id } = request.user;
      const result = await this.profilesService.getProfile(id);
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
      const result = await this.profilesService.updateProfile(
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

  @Get('/api/findNearby')
  async findNearby(@Req() request: RequestWithUser, @Res() response: Response) {
    try {
      const { id } = request.user;
      const { radius } = request.query;

      const profile = await this.profilesService.getProfile(id);

      if (!profile) {
        return response.status(404).json({
          status: 'ERROR',
          message: 'Profile not found',
        });
      }

      const { latitude, longitude } = profile;

      const lat = parseFloat(latitude);
      const long = parseFloat(longitude);
      const rad = parseFloat(radius as string);

      if (isNaN(lat) || isNaN(long) || isNaN(rad)) {
        return response.status(400).json({
          status: 'ERROR',
          message: 'Invalid latitude, longitude or radius',
        });
      }
      const result = await this.profilesService.findNearbyProfiles(
        lat,
        long,
        rad,
      );
      return response.status(200).json({
        status: 'OK',
        message: 'Successfully fetched nearby users',
        data: result,
      });
    } catch (error) {
      return response.status(500).json({
        status: 'ERROR',
        message: 'Failed to fetch nearby users',
        data: error,
      });
    }
  }
}
