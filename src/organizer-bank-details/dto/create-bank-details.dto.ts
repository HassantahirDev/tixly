import { IsString, IsUUID } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';

export class CreateOrganizerBankDetailsDto {
  @ApiProperty({
    description: 'ID of the organizer',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @IsUUID()
  organizerId: string;

  @ApiProperty({
    description: 'Name of the bank',
    example: 'Bank of America'
  })
  @IsString()
  bankName: string;

  @ApiProperty({
    description: 'Bank account number',
    example: '1234567890'
  })
  @IsString()
  accountNumber: string;

  @ApiProperty({
    description: 'Bank account Holder name',
    example: 'John Doe'
  })
  @IsString()
  accountHolder: string;
}


