
import { IsString, IsInt, IsBoolean, IsOptional } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';

export class CreateAdminBankDetailsDto {
  @ApiProperty({ description: 'id of the AdminBankDetails', example: 'example_string' })
  @IsString()
  id: string;

  @ApiProperty({ description: 'adminId of the AdminBankDetails', example: 'example_string' })
  @IsString()
  adminId: string;

  @ApiProperty({ description: 'bankName of the AdminBankDetails', example: 'example_string' })
  @IsString()
  bankName: string;

  @ApiProperty({ description: 'accountNumber of the AdminBankDetails', example: 'example_string' })
  @IsString()
  accountNumber: string;
}
