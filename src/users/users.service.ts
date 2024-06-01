import { Injectable } from '@nestjs/common';
import { PrismaClient, User, Profile } from '@prisma/client';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class UsersService {
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
}
