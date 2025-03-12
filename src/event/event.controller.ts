
import { Controller, Get, Post, Body, Param, Delete, Put, UseGuards, Req } from "@nestjs/common";
import { EventService } from "./event.service";
import { CreateEventDto } from "./dto/create-event.dto";
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";

@ApiTags('Event')
@Controller("event")
export class EventController {
  constructor(private readonly eventService: EventService) {}

  
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post()
  @ApiOperation({ summary: 'Create a new Event' })
  @ApiResponse({ status: 201, description: 'The Event has been successfully created.' })
  create(@Body() createDto: CreateEventDto, @Req() req) {
    
    return this.eventService.create(createDto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get()
  @ApiOperation({ summary: 'Get all Events' })
  @ApiResponse({ status: 200, description: 'List of all Events.' })
  findAll(@Req() req) {
    return this.eventService.findAll(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get(":id")
  @ApiOperation({ summary: 'Get a Event by ID' })
  @ApiResponse({ status: 200, description: 'The Event with the given ID.' })
  @ApiResponse({ status: 404, description: 'Event not found.' })
  findOne(@Param("id") id: string, @Req() req) {
    return this.eventService.findOne(id, req.user.id);
  }

  @Put(":id")
  @ApiOperation({ summary: 'Update a Event by ID' })
  @ApiResponse({ status: 200, description: 'The Event has been successfully updated.' })
  @ApiResponse({ status: 404, description: 'Event not found.' })
  update(@Param("id") id: string, @Body() updateDto: CreateEventDto) {
    return this.eventService.update(id, updateDto);
  }

  @Delete(":id")
  @ApiOperation({ summary: 'Delete a Event by ID' })
  @ApiResponse({ status: 200, description: 'The Event has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Event not found.' })
  remove(@Param("id") id: string) {
    return this.eventService.delete(id);
  }
}
