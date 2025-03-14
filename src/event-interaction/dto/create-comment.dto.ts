import { IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCommentDto {
  @ApiProperty({
    description: 'The content of the comment',
    example: 'This event looks amazing!'
  })
  @IsString()
  content: string;

  @ApiProperty({
    description: 'The ID of the event being commented on',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @IsUUID()
  eventId: string;
} 