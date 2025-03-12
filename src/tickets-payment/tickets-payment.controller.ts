
import { Controller, Get, Post, Body, Param, Req, Delete, Put, UseGuards } from "@nestjs/common";
import { TicketsPaymentService } from "./tickets-payment.service";
import { CreateTicketPaymentDto } from "./dto/create-ticket-payment.dto";
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { UpdateTicketPaymentDto } from "./dto/update-ticket-payment.dto";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";

@ApiTags('Tickets Payment')
@Controller("ticketsPayment")
export class TicketsPaymentController {
  constructor(private readonly ticketsPaymentService: TicketsPaymentService) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post()
  @ApiOperation({ summary: 'Create a new TicketsPayment' })
  @ApiResponse({ status: 201, description: 'The TicketsPayment has been successfully created.' })
  create(@Body() createDto: CreateTicketPaymentDto, @Req() req) {
    return this.ticketsPaymentService.create(createDto, req.user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all TicketsPayments' })
  @ApiResponse({ status: 200, description: 'List of all TicketsPayments.' })
  findAll() {
    return this.ticketsPaymentService.findAll();
  }

  @Get(":id")
  @ApiOperation({ summary: 'Get a TicketsPayment by ID' })
  @ApiResponse({ status: 200, description: 'The TicketsPayment with the given ID.' })
  @ApiResponse({ status: 404, description: 'TicketsPayment not found.' })
  findOne(@Param("id") id: string) {
    return this.ticketsPaymentService.findOne(id);
  }

  @Put(":id")
  @ApiOperation({ summary: 'Update a TicketsPayment by ID' })
  @ApiResponse({ status: 200, description: 'The TicketsPayment has been successfully updated.' })
  @ApiResponse({ status: 404, description: 'TicketsPayment not found.' })
  update(@Param("id") id: string, @Body() updateDto: UpdateTicketPaymentDto) {
    return this.ticketsPaymentService.update(id, updateDto);
  }

  @Delete(":id")
  @ApiOperation({ summary: 'Delete a TicketsPayment by ID' })
  @ApiResponse({ status: 200, description: 'The TicketsPayment has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'TicketsPayment not found.' })
  remove(@Param("id") id: string) {
    return this.ticketsPaymentService.delete(id);
  }
}
