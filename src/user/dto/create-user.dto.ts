
import { IsString, IsInt, IsBoolean, IsOptional } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ description: 'id of the User', example: 'example_string' })
  @IsString()
  id: string;

  @ApiProperty({ description: 'email of the User', example: 'example_string' })
  @IsString()
  email: string;

  @ApiProperty({ description: 'password of the User', example: 'example_string' })
  @IsString()
  password: string;

  @ApiProperty({ description: 'role of the User', example: 'example_value' })
  @IsOptional()
  role: any;

  @ApiProperty({ description: 'name of the User', example: 'example_string' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'eventsAttended of the User', example: 'example_value' })
  @IsOptional()
  eventsAttended: any;

  @ApiProperty({ description: 'notifications of the User', example: 'example_value' })
  @IsOptional()
  notifications: any;

  @ApiProperty({ description: 'createdAt of the User', example: 'example_value' })
  @IsOptional()
  createdAt: any;

  @ApiProperty({ description: 'updatedAt of the User', example: 'example_value' })
  @IsOptional()
  updatedAt: any;

  @ApiProperty({ description: 'TicketsPayment of the User', example: 'example_value' })
  @IsOptional()
  TicketsPayment: any;

  @ApiProperty({ description: 'verificationCode of the User', example: 'example_value' })
  @IsOptional()
  verificationCode: any;

  @ApiProperty({ description: 'isVerified of the User', example: 'true' })
  @IsBoolean()
  isVerified: boolean;
}
