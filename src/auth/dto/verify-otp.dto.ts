import { IsEmail, IsEnum, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';

export class VerifyOtpDto {
  @ApiProperty({ example: 'user@example.com', description: 'User email address' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '1234', description: '4-digit verification code' })
  @IsString()
  @Length(4, 4)
  code: string;

  @ApiProperty({ example: 'USER', description: 'User role (USER or ORGANIZER)' })
  @IsEnum(Role)
  role: Role;
}
