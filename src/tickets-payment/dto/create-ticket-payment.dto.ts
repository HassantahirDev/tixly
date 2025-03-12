import { IsString, IsNumber, IsEnum, IsUUID, IsOptional, Min, IsUrl } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PaymentStatus } from '@prisma/client';

export class CreateTicketPaymentDto {
  

  @ApiProperty({
    description: 'URL of the payment proof image',
    example: 'https://storage.example.com/payments/proof-123.jpg'
  })
  @IsString()
  @IsUrl({
    protocols: ['https'],
    require_protocol: true
  })
  screenshotUrl: string;

  @ApiProperty({
    description: 'Quantity of tickets being paid for',
    example: 2
  })
  @IsNumber()
  @Min(1)
  quantity: number;

  @ApiProperty({
    description: 'URL of the QR code image',
    example: 'https://storage.example.com/qr-codes/qr-123.jpg'
  })
  @IsString()
  @IsOptional()
  qrCodeUrl?: string;


  @ApiProperty({
    description: 'UUID of the event being paid for',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @IsUUID()
  eventId: string;
} 