import { IsString, IsNotEmpty, IsOptional, IsEmail } from 'class-validator';

export class LoginUserDto {
  @IsString()
  @IsOptional()
  username: string;

  @IsEmail()
  @IsOptional()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
