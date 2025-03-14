import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { CreateReplyDto } from './dto/create-reply.dto';

@Injectable()
export class EventInteractionService {
  constructor(private prisma: PrismaService) {}

  async createComment(userId: string, dto: CreateCommentDto) {
    const event = await this.prisma.event.findUnique({
      where: { id: dto.eventId }
    });

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    console.log("userId", userId);
    console.log(dto);

    return this.prisma.comment.create({
      data: {
        content: dto.content,
        userId,
        eventId: dto.eventId
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            profilePic: true
          }
        }
      }
    });
  }

  async createReply(userId: string, dto: CreateReplyDto) {
    const comment = await this.prisma.comment.findUnique({
      where: { id: dto.commentId }
    });

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    return this.prisma.reply.create({
      data: {
        content: dto.content,
        userId,
        commentId: dto.commentId
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            profilePic: true
          }
        }
      }
    });
  }

  async toggleCommentLike(userId: string, commentId: string) {
    const comment = await this.prisma.comment.findUnique({
      where: { id: commentId }
    });

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    const existingLike = await this.prisma.commentLike.findUnique({
      where: {
        userId_commentId: {
          userId,
          commentId
        }
      }
    });

    if (existingLike) {
      await this.prisma.commentLike.delete({
        where: { id: existingLike.id }
      });
      return { liked: false };
    }

    await this.prisma.commentLike.create({
      data: {
        userId,
        commentId
      }
    });
    return { liked: true };
  }

  async toggleReplyLike(userId: string, replyId: string) {
    const reply = await this.prisma.reply.findUnique({
      where: { id: replyId }
    });

    if (!reply) {
      throw new NotFoundException('Reply not found');
    }

    const existingLike = await this.prisma.replyLike.findUnique({
      where: {
        userId_replyId: {
          userId,
          replyId
        }
      }
    });

    if (existingLike) {
      await this.prisma.replyLike.delete({
        where: { id: existingLike.id }
      });
      return { liked: false };
    }

    await this.prisma.replyLike.create({
      data: {
        userId,
        replyId
      }
    });
    return { liked: true };
  }

  async toggleFavorite(userId: string, eventId: string) {
    const event = await this.prisma.event.findUnique({
      where: { id: eventId }
    });

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    const existingFavorite = await this.prisma.favorite.findUnique({
      where: {
        userId_eventId: {
          userId,
          eventId
        }
      }
    });

    if (existingFavorite) {
      await this.prisma.favorite.delete({
        where: { id: existingFavorite.id }
      });
      return { favorited: false };
    }

    await this.prisma.favorite.create({
      data: {
        userId,
        eventId
      }
    });
    return { favorited: true };
  }

  async getEventComments(eventId: string) {
    const event = await this.prisma.event.findUnique({
      where: { id: eventId }
    });

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    return this.prisma.comment.findMany({
      where: { eventId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            profilePic: true
          }
        },
        replies: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                profilePic: true
              }
            },
            likes: true
          }
        },
        likes: true
      },
      orderBy: { createdAt: 'desc' }
    });
  }
} 