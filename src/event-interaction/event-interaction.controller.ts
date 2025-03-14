import { Controller, Post, Body, Param, Get, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

import { EventInteractionService } from './event-interaction.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { CreateReplyDto } from './dto/create-reply.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@ApiTags('Event Interactions')
@Controller('events')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class EventInteractionController {
  constructor(private readonly eventInteractionService: EventInteractionService) {}

  @Post('comments')
  @ApiOperation({ summary: 'Create a comment on an event' })
  @ApiResponse({ status: 201, description: 'Comment created successfully' })
  async createComment(@Req() req, @Body() dto: CreateCommentDto) {
    return this.eventInteractionService.createComment(req.user.id, dto);
  }

  @Post('comments/:commentId/replies')
  @ApiOperation({ summary: 'Create a reply to a comment' })
  @ApiResponse({ status: 201, description: 'Reply created successfully' })
  async createReply(
    @Req() req,
    @Param('commentId') commentId: string,
    @Body() dto: CreateReplyDto
  ) {
    return this.eventInteractionService.createReply(req.user.id, dto);
  }

  @Post('comments/:commentId/like')
  @ApiOperation({ summary: 'Toggle like on a comment' })
  @ApiResponse({ status: 200, description: 'Like toggled successfully' })
  async toggleCommentLike(
    @Req() req,
    @Param('commentId') commentId: string
  ) {
    return this.eventInteractionService.toggleCommentLike(req.user.id, commentId);
  }

  @Post('replies/:replyId/like')
  @ApiOperation({ summary: 'Toggle like on a reply' })
  @ApiResponse({ status: 200, description: 'Like toggled successfully' })
  async toggleReplyLike(
    @Req() req,
    @Param('replyId') replyId: string
  ) {
    return this.eventInteractionService.toggleReplyLike(req.user.id, replyId);
  }

  @Post(':eventId/favorite')
  @ApiOperation({ summary: 'Toggle favorite on an event' })
  @ApiResponse({ status: 200, description: 'Favorite toggled successfully' })
  async toggleFavorite(
    @Req() req,
    @Param('eventId') eventId: string
  ) {
    return this.eventInteractionService.toggleFavorite(req.user.id, eventId);
  }

  @Get(':eventId/comments')
  @ApiOperation({ summary: 'Get all comments for an event' })
  @ApiResponse({ status: 200, description: 'Comments retrieved successfully' })
  async getEventComments(@Param('eventId') eventId: string) {
    return this.eventInteractionService.getEventComments(eventId);
  }
} 