
import { IsString, IsInt, IsBoolean, IsOptional } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';

export class CreateAdminDto {
  @ApiProperty({ description: 'id of the Admin', example: 'example_string' })
  @IsString()
  id: string;

  @ApiProperty({ description: 'email of the Admin', example: 'example_string' })
  @IsString()
  email: string;

  @ApiProperty({ description: 'password of the Admin', example: 'example_string' })
  @IsString()
  password: string;

  @ApiProperty({ description: 'notifications of the Admin', example: 'example_value' })
  @IsOptional()
  notifications: any;

  @ApiProperty({ description: 'createdAt of the Admin', example: 'example_value' })
  @IsOptional()
  createdAt: any;

  @ApiProperty({ description: 'updatedAt of the Admin', example: 'example_value' })
  @IsOptional()
  updatedAt: any;
}
