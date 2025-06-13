
import { Controller, Get, Post, Body, Param, Delete, Put, UseGuards, Req } from "@nestjs/common";
import { NotificationService } from "./notification.service";
import { CreateNotificationDto } from "./dto/create-notification.dto";
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";

@ApiTags('Notification')
@Controller("notification")
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new Notification' })
  @ApiResponse({ status: 201, description: 'The Notification has been successfully created.' })
  create(@Body() createDto: CreateNotificationDto) {
    return this.notificationService.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all Notifications' })
  @ApiResponse({ status: 200, description: 'List of all Notifications.' })
  findAll() {
    return this.notificationService.findAll();
  }

  @ApiBearerAuth()
  @Get('me/:userId')
  @ApiParam({ name: 'userId', description: 'ID of the user to get notifications for' })
  @ApiOperation({ summary: 'Get all Notifications for the logged-in user' })
  @ApiResponse({ status: 200, description: 'List of all Notifications for the logged-in user.' })
  findAllForUser(@Param('userId') userId: string) {
    return this.notificationService.findAllForUser(userId);
  }

  @ApiBearerAuth()
  @Get('mark-as-read/:userId')
  @ApiParam({ name: 'userId', description: 'ID of the user to get notifications for' })
  @ApiOperation({ summary: 'Mark all Notifications as read for the logged-in user' })
  @ApiResponse({ status: 200, description: 'All Notifications marked as read for the logged-in user.' })
  markAllAsReadForUser(@Param('userId') userId: string) {
    return this.notificationService.markAllAsReadForUser(userId);
  }

  @Get(":id")
  @ApiOperation({ summary: 'Get a Notification by ID' })
  @ApiResponse({ status: 200, description: 'The Notification with the given ID.' })
  @ApiResponse({ status: 404, description: 'Notification not found.' })
  findOne(@Param("id") id: string) {
    return this.notificationService.findOne(id);
  }

  @Put(":id")
  @ApiOperation({ summary: 'Update a Notification by ID' })
  @ApiResponse({ status: 200, description: 'The Notification has been successfully updated.' })
  @ApiResponse({ status: 404, description: 'Notification not found.' })
  update(@Param("id") id: string, @Body() updateDto: CreateNotificationDto) {
    return this.notificationService.update(id, updateDto);
  }

  @Delete(":id")
  @ApiOperation({ summary: 'Delete a Notification by ID' })
  @ApiResponse({ status: 200, description: 'The Notification has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Notification not found.' })
  remove(@Param("id") id: string) {
    return this.notificationService.delete(id);
  }
}
