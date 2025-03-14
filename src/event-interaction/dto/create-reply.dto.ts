import { IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateReplyDto {
  @ApiProperty({
    description: 'The content of the reply',
    example: 'Yes, I agree with you!'
  })
  @IsString()
  content: string;

  @ApiProperty({
    description: 'The ID of the comment being replied to',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @IsUUID()
  commentId: string;
} 