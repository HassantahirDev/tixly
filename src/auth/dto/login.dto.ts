import { IsEmail, IsEnum, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';

export class LoginDto {
  @ApiProperty({ example: 'Ressie54@gmail.com', description: 'User email address' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'password123', description: 'User password' })
  @IsString()
  password: string;

  @ApiProperty({ example: 'USER', description: 'User role (USER or ORGANIZER)' })
  @IsEnum(Role)
  role: Role;
}