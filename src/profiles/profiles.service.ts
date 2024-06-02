import { Injectable } from '@nestjs/common';
import { PrismaClient, User, Profile } from '@prisma/client';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import axios from 'axios';

@Injectable()
export class ProfilesService {
  constructor(private prisma: PrismaClient) {}

  async getAllUsers(): Promise<User[]> {
    return this.prisma.user.findMany();
  }

  async createProfile(
    createProfileDto: CreateProfileDto,
    userId: string,
  ): Promise<Profile> {
    const {
      displayName,
      gender,
      birthDate,
      horoscope,
      zodiac,
      height,
      weight,
      interests,
      profilePic,
    } = createProfileDto;

    const location = await axios.get(
      `https://api.ipgeolocation.io/ipgeo?apiKey=${process.env.IP_API_KEY}`,
    );

    const { latitude, longitude } = location.data;

    if (!latitude || !longitude) {
      throw new Error('Failed to get location');
    }

    try {
      return this.prisma.profile.create({
        data: {
          displayName,
          gender,
          birthDate: new Date(birthDate),
          horoscope,
          zodiac,
          height,
          weight,
          interests,
          profilePic,
          longitude: longitude,
          latitude: latitude,
          user: {
            connect: {
              id: userId,
            },
          },
        },
      });
    } catch (error) {
      throw new Error('Failed to create profile');
    }
  }

  async getProfile(usersId: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        id: usersId,
      },
      include: {
        profile: true,
      },
    });

    if (!user) {
      throw new Error('User not found');
    }

    const profile = this.prisma.profile.findFirst({
      where: {
        userId: user.id,
      },
    });

    if (!profile) {
      throw new Error('Profile not found');
    }

    return profile;
  }

  async updateProfile(userId: string, updateProfileDto: UpdateProfileDto) {
    const user = await this.prisma.user.findFirst({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new Error('User not found');
    }

    const profile = await this.prisma.profile.findFirst({
      where: {
        userId: user.id,
      },
    });

    if (!profile) {
      throw new Error('Profile not found');
    }

    const {
      displayName,
      gender,
      birthDate,
      horoscope,
      zodiac,
      height,
      weight,
      interests,
      profilePic,
    } = updateProfileDto;

    return this.prisma.profile.update({
      where: {
        id: profile.id,
      },
      data: {
        displayName,
        gender,
        birthDate: new Date(birthDate),
        horoscope,
        zodiac,
        height,
        weight,
        interests,
        profilePic,
      },
    });
  }

  async findNearbyProfiles(
    latitude: number,
    longitude: number,
    radius: number,
  ): Promise<Profile[]> {
    const degreePerKilometer = 1 / 111;
    const radiusInDegrees = radius * degreePerKilometer;
    const profiles = await this.prisma.profile.findMany({
      where: {
        AND: [
          {
            latitude: {
              gte: String(latitude - radiusInDegrees),
              lte: String(latitude + radiusInDegrees),
            },
          },
          {
            longitude: {
              gte: String(longitude - radiusInDegrees),
              lte: String(longitude + radiusInDegrees),
            },
          },
        ],
      },
    });
    return profiles;
  }
}
