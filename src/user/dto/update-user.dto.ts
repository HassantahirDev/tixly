
import { IsString, IsInt, IsBoolean, IsOptional } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiProperty({ description: 'email of the User', example: 'example_string' })
  @IsOptional()
  @IsString()
  email?: string;

  @ApiProperty({ description: 'name of the User', example: 'example_string' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ description: 'username of the User', example: 'example_string' })
  @IsOptional()
  @IsString()
  username?: string;
}
