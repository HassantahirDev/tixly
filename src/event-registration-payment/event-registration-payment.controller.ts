
import { Controller, Get, Post, Body, Param, Delete, Put } from "@nestjs/common";
import { EventRegistrationPaymentService } from "./event-registration-payment.service";
import { CreateEventRegistrationPaymentDto } from "./dto/create-event-registration-payment.dto";
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Event Registration Payment Service')
@Controller("eventRegistrationPaymentService")
export class EventRegistrationPaymentController {
  constructor(private readonly eventRegistrationPaymentService: EventRegistrationPaymentService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new Payment' })
  @ApiResponse({ status: 201, description: 'The Payment has been successfully created.' })
  create(@Body() createDto: CreateEventRegistrationPaymentDto) {
    return this.eventRegistrationPaymentService.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all Payments' })
  @ApiResponse({ status: 200, description: 'List of all Payments.' })
  findAll() {
    return this.eventRegistrationPaymentService.findAll();
  }

  

  @Get(":id")
  @ApiOperation({ summary: 'Get a Payment by ID' })
  @ApiResponse({ status: 200, description: 'The Payment with the given ID.' })
  @ApiResponse({ status: 404, description: 'Payment not found.' })
  findOne(@Param("id") id: string) {
    return this.eventRegistrationPaymentService.findOne(id);
  }

  @Put(":id")
  @ApiOperation({ summary: 'Update a Payment by ID' })
  @ApiResponse({ status: 200, description: 'The Payment has been successfully updated.' })
  @ApiResponse({ status: 404, description: 'Payment not found.' })
  update(@Param("id") id: string, @Body() updateDto: CreateEventRegistrationPaymentDto) {
    return this.eventRegistrationPaymentService.update(id, updateDto);
  }

  @Delete(":id")
  @ApiOperation({ summary: 'Delete a Payment by ID' })
  @ApiResponse({ status: 200, description: 'The Payment has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Payment not found.' })
  remove(@Param("id") id: string) {
    return this.eventRegistrationPaymentService.delete(id);
  }
}
