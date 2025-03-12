
import { Controller, Get, Post, Body, Param, Delete, Put } from "@nestjs/common";
import { OrganizerService } from "./organizer.service";
import { CreateOrganizerDto } from "./dto/create-organizer.dto";
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UpdateOrganizerDto } from "./dto/update-organizer.dto";

@ApiTags('Organizer')
@Controller("organizer")
export class OrganizerController {
  constructor(private readonly organizerService: OrganizerService) {}

  // @Post()
  // @ApiOperation({ summary: 'Create a new Organizer' })
  // @ApiResponse({ status: 201, description: 'The Organizer has been successfully created.' })
  // create(@Body() createDto: CreateOrganizerDto) {
  //   return this.organizerService.create(createDto);
  // }

  @Post("approveTicketsPayment/:id")
  @ApiOperation({ summary: 'Approve a Payment' })
  @ApiResponse({ status: 200, description: 'The Payment has been successfully approved.' })
  approveTicketsPayment(@Param("id") id: string) {
    return this.organizerService.approveTicketsPayment(id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all Organizers' })
  @ApiResponse({ status: 200, description: 'List of all Organizers.' })
  findAll() {
    return this.organizerService.findAll();
  }

  @Post("disapproveTicketsPayment/:id")
  @ApiOperation({ summary: 'Disapprove a Payment' })
  @ApiResponse({ status: 200, description: 'The Payment has been successfully disapproved.' })
  disapproveTicketsPayment(@Param("id") id: string) {
    return this.organizerService.disapproveTicketsPayment(id);
  }

  @Get(":id")
  @ApiOperation({ summary: 'Get a Organizer by ID' })
  @ApiResponse({ status: 200, description: 'The Organizer with the given ID.' })
  @ApiResponse({ status: 404, description: 'Organizer not found.' })
  findOne(@Param("id") id: string) {
    return this.organizerService.findOne(id);
  }

  @Put(":id")
  @ApiOperation({ summary: 'Update a Organizer by ID' })
  @ApiResponse({ status: 200, description: 'The Organizer has been successfully updated.' })
  @ApiResponse({ status: 404, description: 'Organizer not found.' })
  update(@Param("id") id: string, @Body() updateDto: UpdateOrganizerDto) {
    return this.organizerService.update(id, updateDto);
  }

  @Delete(":id")
  @ApiOperation({ summary: 'Delete a Organizer by ID' })
  @ApiResponse({ status: 200, description: 'The Organizer has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Organizer not found.' })
  remove(@Param("id") id: string) {
    return this.organizerService.delete(id);
  }
}
