import { IsString, IsInt, IsBoolean, IsOptional, IsUrl } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateEventCategoryDto {
  @ApiProperty({
    description: 'name of the EventCategory',
    example: 'example_string',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'attachment of the EventCategory',
    example: 'example_string',
  })
  @IsOptional()
  @IsUrl()
  attachment: string;
}
