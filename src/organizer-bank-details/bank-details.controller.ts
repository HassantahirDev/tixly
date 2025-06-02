import { Controller, Get, Post, Body, Param, Delete, Put, Query } from "@nestjs/common";
import { BankDetailsService } from "./bank-details.service";
import { CreateOrganizerBankDetailsDto } from "./dto/create-bank-details.dto";
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';

@ApiTags('BankDetails')
@Controller("bankDetails")
export class BankDetailsController {
  constructor(private readonly bankDetailsService: BankDetailsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new BankDetails' })
  @ApiResponse({ status: 201, description: 'The BankDetails has been successfully created.' })
  create(@Body() createDto: CreateOrganizerBankDetailsDto) {
    return this.bankDetailsService.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all BankDetailss' })
  @ApiResponse({ status: 200, description: 'List of all BankDetailss.' })
  findAll() {
    return this.bankDetailsService.findAll();
  }

  @Get(":id")
  @ApiOperation({ summary: 'Get a BankDetails by ID' })
  @ApiResponse({ status: 200, description: 'The BankDetails with the given ID.' })
  @ApiResponse({ status: 404, description: 'BankDetails not found.' })
  findOne(@Param("id") id: string) {
    return this.bankDetailsService.findOne(id);
  }

  @Put(":id")
  @ApiOperation({ summary: 'Update a BankDetails by ID' })
  @ApiResponse({ status: 200, description: 'The BankDetails has been successfully updated.' })
  @ApiResponse({ status: 404, description: 'BankDetails not found.' })
  update(@Param("id") id: string, @Body() updateDto: CreateOrganizerBankDetailsDto) {
    return this.bankDetailsService.update(id, updateDto);
  }

  @Delete(":id")
  @ApiOperation({ summary: 'Delete a BankDetails by ID' })
  @ApiResponse({ status: 200, description: 'The BankDetails has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'BankDetails not found.' })
  remove(@Param("id") id: string) {
    return this.bankDetailsService.delete(id);
  }

  @Get('organizer/:id')
  @ApiOperation({ summary: 'Get BankDetails for an Organizer by ID and optionally filter by bank name' })
  @ApiQuery({ name: 'bankName', required: false, type: String, description: 'Filter by bank name' })
  @ApiResponse({ status: 200, description: 'List of BankDetails for the specified Organizer.' })
  findByOrganizerIdAndBankName(
    @Param('id') organizerId: string,
    @Query('bankName') bankName?: string
  ) {
    return this.bankDetailsService.findByOrganizerIdAndBankName(organizerId, bankName);
  }
}
