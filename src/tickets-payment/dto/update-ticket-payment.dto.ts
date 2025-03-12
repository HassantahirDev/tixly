import { PartialType } from '@nestjs/swagger';
import { CreateTicketPaymentDto } from './create-ticket-payment.dto';

export class UpdateTicketPaymentDto extends PartialType(CreateTicketPaymentDto) {} 