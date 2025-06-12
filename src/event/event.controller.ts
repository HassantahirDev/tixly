import { Controller, Get, Post, Body, Param, Delete, Put, UseGuards, Req, Query } from "@nestjs/common";
import { EventService } from "./event.service";
import { CreateEventDto } from "./dto/create-event.dto";
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { Q } from "@faker-js/faker/dist/airline-CBNP41sR";

@ApiTags('Events')
@Controller('events')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post()
  @ApiOperation({ summary: 'Create a new Event' })
  @ApiResponse({ status: 201, description: 'The Event has been successfully created.' })
  create(@Body() createDto: CreateEventDto, @Req() req) {
    console.log("Creating event with data:", createDto);
    return this.eventService.create(createDto);
  }

  @ApiBearerAuth()
  @Get()
  @ApiQuery({
    name: 'userId',
    required: false,
    description: 'Filter events by user ID (optional)',
    type: String
  })
  @ApiOperation({ summary: 'Get all Events' })
  @ApiResponse({ status: 200, description: 'List of all Events.' })
  findAll(@Query('userId') userId?: string) {
    return this.eventService.findAll(userId);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all Favourite Events for a specific user' })
  @Get('favourites')
  findAllFavourites(@Req() req) {
    return this.eventService.findAllFavouritesForAUser(req.user.id);
  }

  @Get('search')
  @ApiOperation({ summary: 'Search events by title, description, or location' })
  @ApiResponse({ status: 200, description: 'List of events matching the search query' })
  @ApiResponse({ status: 400, description: 'No events found' })
  searchEvents(@Query('query') query: string) {
    return this.eventService.searchEvents(query);
  }

  @Get('upcoming')
  @ApiOperation({ summary: 'Get all upcoming events due in two days or less' })
  @ApiResponse({ status: 200, description: 'List of upcoming events (within 2 days).' })
  getUpcomingEvents() {
    return this.eventService.getUpcomingEvents();
  }

  @Get('ongoing')
  @ApiOperation({ summary: 'Get all ongoing events (2 hours before start to 30 minutes after end)' })
  @ApiResponse({ status: 200, description: 'List of ongoing events.' })
  getOngoingEvents() {
    return this.eventService.getOngoingEvents();
  }

  @ApiBearerAuth()
  @Get(":id")
  @ApiOperation({ summary: 'Get a Event by ID' })
  @ApiResponse({ status: 200, description: 'The Event with the given ID.' })
  @ApiResponse({ status: 404, description: 'Event not found.' })
  findOne(@Param("id") id: string) {
    return this.eventService.findOne(id);
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

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('top/featured')
  @ApiOperation({ summary: 'Get featured events' })
  @ApiResponse({ 
    status: 200, 
    description: 'Returns top 5 featured events based on popularity and engagement' 
  })
  getFeaturedEvents() {
    return this.eventService.getFeaturedEvents();
  }

  @Post('top-by-location')
  @ApiOperation({ summary: 'Get top events by location' })
  @ApiResponse({ 
    status: 200, 
    description: 'Returns top events in a specific location' 
  })
  @ApiQuery({ 
    name: 'location', 
    required: true, 
    description: 'Location to search events in' 
  })
  @ApiQuery({ 
    name: 'limit', 
    required: false, 
    description: 'Number of events to return (default: 10)' 
  })
  getTopEventsByLocation(
    @Query('location') location: string,
    @Query('limit') limit?: number
  ) {
    return this.eventService.getTopEventsByLocation(location, limit);
  }

  
}
