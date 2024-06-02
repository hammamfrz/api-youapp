import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsDateString,
} from 'class-validator';

export class CreateProfileDto {
  @IsString()
  @IsNotEmpty()
  displayName: string;

  @IsString()
  @IsNotEmpty()
  gender: string;

  @IsDateString()
  @IsNotEmpty()
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

  @IsOptional()
  latitude: number;

  @IsOptional()
  longitude: number;
}
