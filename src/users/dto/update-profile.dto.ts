import { IsString, IsOptional, IsDateString, IsNumber } from 'class-validator';

export class UpdateProfileDto {
  @IsString()
  @IsOptional()
  displayName: string;

  @IsString()
  @IsOptional()
  gender: string;

  @IsDateString()
  @IsOptional()
  birthDate: Date;

  @IsString()
  @IsOptional()
  horoscope: string;

  @IsString()
  @IsOptional()
  zodiac: string;

  @IsNumber()
  @IsOptional()
  height: number;

  @IsNumber()
  @IsOptional()
  weight: number;

  @IsString({ each: true })
  @IsOptional()
  interests: string[];

  @IsString()
  @IsOptional()
  profilePic: string;
}
