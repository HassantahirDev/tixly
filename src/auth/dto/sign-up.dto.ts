import { IsEmail, IsEnum, IsOptional, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';

export class SignUpDto {
  @ApiProperty({ example: 'user@example.com', description: 'User email address' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'StrongPassword123', description: 'User password (min 8 characters)' })
  @IsString()
  @MinLength(8)
  password: string;

  @ApiProperty({ example: 'John Doe', description: 'User full name' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'USER', description: 'User role (USER or ORGANIZER)' })
  @IsEnum(Role)
  @IsOptional()
  role: Role = Role.USER;

  @ApiProperty({ example: 'https://example.com/profile.jpg', description: 'Profile picture URL' })
  @IsString()
  @IsOptional()
  profilePic?: string;
}