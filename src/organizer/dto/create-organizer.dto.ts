import { IsString, IsEmail, IsOptional, MinLength } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';

export class CreateOrganizerDto {
  @ApiProperty({ 
    description: 'Email address of the organizer',
    example: 'organizer@example.com'
  })
  @IsEmail()
  email: string;

  @ApiProperty({ 
    description: 'Password for the organizer account',
    example: 'StrongP@ssw0rd'
  })
  @IsString()
  @MinLength(8)
  password: string;

  @ApiProperty({ 
    description: 'Full name of the organizer',
    example: 'John Smith Events'
  })
  @IsString()
  name: string;

  @ApiProperty({ 
    description: 'Profile picture URL',
    example: 'https://example.com/profile.jpg'
  })
  @IsString()
  @IsOptional()
  profilePic?: string;
}
