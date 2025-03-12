import { IsString, IsNumber, IsEnum, IsUUID, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PaymentStatus } from '@prisma/client';

export class CreateEventRegistrationPaymentDto {
  @ApiProperty({
    description: 'Payment amount',
    example: 499.99,
    minimum: 0
  })
  @IsNumber()
  amount: number;

  @ApiProperty({
    description: 'URL of the payment screenshot/proof',
    example: 'https://example.com/payment-proof.jpg'
  })
  @IsString()
  screenshotUrl: string;


  @ApiProperty({
    description: 'ID of the organizer making the payment',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false
  })
  @IsUUID()
  organizerId: string;

  @ApiProperty({
    description: 'ID of the event',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false
  })
  @IsUUID()
  eventId: string;
}
