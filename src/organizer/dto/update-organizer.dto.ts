import { IsString, IsOptional, IsBoolean, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateOrganizerDto {
  @ApiProperty({
    description: "Organizer's email",
    example: 'organizer@example.com',
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({
    description: "Organizer's profile picture URL",
    example: 'https://example.com/profile.jpg',
  })
  @IsOptional()
  @IsString()
  profilePic?: string;

  @ApiProperty({ description: "Organizer's name", example: 'John Doe' })
  @IsOptional()
  @IsString()
  name?: string;
}
