import { IsString, IsOptional, IsUUID } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';

export class CreateNotificationDto {
  @ApiProperty({
    description: 'User ID (optional)',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false
  })
  @IsUUID()
  @IsOptional()
  userId?: string;

  @ApiProperty({
    description: 'Organizer ID (optional)',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false
  })
  @IsUUID()
  @IsOptional()
  organizerId?: string;

  @ApiProperty({
    description: 'Admin ID (optional)',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false
  })
  @IsUUID()
  @IsOptional()
  adminId?: string;

   @ApiProperty({
    description: 'Event ID (optional)',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false
  })
  @IsUUID()
  @IsOptional()
  eventId?: string;

  @ApiProperty({
    description: 'Notification message',
    example: 'Your event has been approved!'
  })
  @IsString()
  message: string;

  @ApiProperty({
    description: 'Organizer bank details ID (optional)',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false
  })
  @IsUUID()
  @IsOptional()
  organizerBankDetailsId?: string;
}
