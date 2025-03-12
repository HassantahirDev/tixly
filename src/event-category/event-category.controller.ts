
import { Controller, Get, Post, Body, Param, Delete, Put } from "@nestjs/common";
import { EventCategoryService } from "./event-category.service";
import { CreateEventCategoryDto } from "./dto/create-event-category.dto";
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Event Category')
@Controller("eventCategory")
export class EventCategoryController {
  constructor(private readonly eventCategoryService: EventCategoryService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new EventCategory' })
  @ApiResponse({ status: 201, description: 'The EventCategory has been successfully created.' })
  create(@Body() createDto: CreateEventCategoryDto) {
    return this.eventCategoryService.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all EventCategories' })
  @ApiResponse({ status: 200, description: 'List of all EventCategories.' })
  findAll() {
    return this.eventCategoryService.findAll();
  }

  @Get(":id")
  @ApiOperation({ summary: 'Get a EventCategory by ID' })
  @ApiResponse({ status: 200, description: 'The EventCategory with the given ID.' })
  @ApiResponse({ status: 404, description: 'EventCategory not found.' })
  findOne(@Param("id") id: string) {
    return this.eventCategoryService.findOne(id);
  }

  @Put(":id")
  @ApiOperation({ summary: 'Update a EventCategory by ID' })
  @ApiResponse({ status: 200, description: 'The EventCategory has been successfully updated.' })
  @ApiResponse({ status: 404, description: 'EventCategory not found.' })
  update(@Param("id") id: string, @Body() updateDto: CreateEventCategoryDto) {
    return this.eventCategoryService.update(id, updateDto);
  }

  @Delete(":id")
  @ApiOperation({ summary: 'Delete a EventCategory by ID' })
  @ApiResponse({ status: 200, description: 'The EventCategory has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'EventCategory not found.' })
  remove(@Param("id") id: string) {
    return this.eventCategoryService.delete(id);
  }
}
