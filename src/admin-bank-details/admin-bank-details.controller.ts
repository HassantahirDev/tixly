
import { Controller, Get, Post, Body, Param, Delete, Put } from "@nestjs/common";
import { AdminBankDetailsService } from "./admin-bank-details.service";
import { CreateAdminBankDetailsDto } from "./dto/create-admin-bank-details.dto";
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('AdminBankDetails')
@Controller("adminBankDetails")
export class AdminBankDetailsController {
  constructor(private readonly adminBankDetailsService: AdminBankDetailsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new AdminBankDetails' })
  @ApiResponse({ status: 201, description: 'The AdminBankDetails has been successfully created.' })
  create(@Body() createDto: CreateAdminBankDetailsDto) {
    return this.adminBankDetailsService.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all AdminBankDetailss' })
  @ApiResponse({ status: 200, description: 'List of all AdminBankDetails.' })
  findAll() {
    return this.adminBankDetailsService.findAll();
  }

  @Get(":id")
  @ApiOperation({ summary: 'Get a AdminBankDetails by ID' })
  @ApiResponse({ status: 200, description: 'The AdminBankDetails with the given ID.' })
  @ApiResponse({ status: 404, description: 'AdminBankDetails not found.' })
  findOne(@Param("id") id: string) {
    return this.adminBankDetailsService.findOne(id);
  }

  @Put(":id")
  @ApiOperation({ summary: 'Update a AdminBankDetails by ID' })
  @ApiResponse({ status: 200, description: 'The AdminBankDetails has been successfully updated.' })
  @ApiResponse({ status: 404, description: 'AdminBankDetails not found.' })
  update(@Param("id") id: string, @Body() updateDto: CreateAdminBankDetailsDto) {
    return this.adminBankDetailsService.update(id, updateDto);
  }

  @Delete(":id")
  @ApiOperation({ summary: 'Delete a AdminBankDetails by ID' })
  @ApiResponse({ status: 200, description: 'The AdminBankDetails has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'AdminBankDetails not found.' })
  remove(@Param("id") id: string) {
    return this.adminBankDetailsService.delete(id);
  }
}
