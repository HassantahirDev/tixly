import {
  IsString,
  IsInt,
  IsBoolean,
  IsOptional,
  IsNumber,
  IsDate,
  IsDateString,
  IsUUID,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateEventDto {
  @ApiProperty({
    description: 'Title of the event',
    example: 'Summer Music Festival 2024',
  })
  @IsString()
  title: string;

  @ApiProperty({
    description: 'ID of the event category',
    example: '456e4567-e89b-12d3-a456-426614174001',
  })
  @IsUUID()
  eventCategoryId: string;

  @ApiProperty({
    description: 'Detailed description of the event',
    example:
      'Join us for the biggest music festival of the summer featuring top artists...',
  })
  @IsString()
  description: string;

  @ApiProperty({
    description: 'Event date and time',
    example: '2024-07-15T18:00:00Z',
  })
  @IsDateString()
  date: string;

  @ApiProperty({
    description: 'Event start time',
    example: '2024-07-15T18:00:00Z',
  })
  @IsDateString()
  startTime: string;

  @ApiProperty({
    description: 'Event end time',
    example: '2024-07-15T18:00:00Z',
  })
  @IsDateString()
  endTime: string;

  @ApiProperty({
    description: 'Event capacity',
    example: 500,
  })
  @IsNumber()
  capacity: number;

  @ApiProperty({
    description: 'Event location/venue',
    example: 'Central Park, New York',
  })
  @IsString()
  location: string;

  @ApiProperty({
    description: 'Event ticket price',
    example: 49.99,
  })
  @IsNumber()
  price: number;

  @ApiProperty({
    description: 'ID of the organizer creating the event',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  organizerId: string;
}
