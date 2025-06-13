import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateNotificationDto } from './dto/create-notification.dto';

@Injectable()
export class NotificationService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    try {
      const Notification = await this.prisma.notification.findMany();
      return {
        success: true,
        data: Notification,
        message: 'Notifications fetched successfully',
      };
    } catch (error) {
      throw new BadRequestException('Error fetching all records.');
    }
  }

  async findAllForUser(userId: string) {
    try {
      const notifications = await this.prisma.notification.findMany({
        where: { userId, read: false},
        include: {
          event: true,
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });
      return {
        success: true,
        data: notifications,
        message: 'User notifications fetched successfully',
      };
    } catch (error) {
      throw new BadRequestException('Error fetching user notifications.');
    }
  }

  async markAllAsReadForUser(userId: string) {
    try {
      const notifications = await this.prisma.notification.updateMany({
        where: { userId, read: false },
        data: { read: true },
      });
      return {
        success: true,
        data: notifications,
        message: 'All notifications marked as read successfully',
      };
    } catch (error) {
      throw new BadRequestException('Error marking notifications as read.');
    }
  }

  async findOne(id: string) {
    try {
      const Notification = await this.prisma.notification.findUnique({
        where: { id },
      });
      if (!Notification) {
        throw new NotFoundException(`Notification with id ${id} not found`);
      }
      return {
        success: true,
        data: Notification,
        message: 'Notification fetched successfully',
      };
    } catch (error) {
      throw error instanceof NotFoundException
        ? error
        : new BadRequestException('Error fetching record.');
    }
  }

  async create(data: CreateNotificationDto) {
    try {
      const Notification = await this.prisma.notification.create({ data });
      return {
        success: true,
        data: Notification,
        message: 'Notification created successfully',
      };
    } catch (error) {
      throw new BadRequestException('Error creating record.');
    }
  }

  async update(id: string, data: CreateNotificationDto) {
    try {
      const Notification = await this.prisma.notification.update({
        where: { id },
        data,
      });
      return {
        success: true,
        data: Notification,
        message: 'Notification updated successfully',
      };
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(
          `Notification with id: ${id} not found for update`,
        );
      }
      throw new BadRequestException('Error updating record.');
    }
  }

  async delete(id: string) {
    try {
      const Notification = await this.prisma.notification.delete({
        where: { id },
      });
      return {
        success: true,
        data: Notification,
        message: 'Notification deleted successfully',
      };
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(
          `Notification with id ${id} not found for deletion`,
        );
      }
      throw new BadRequestException('Error deleting record.');
    }
  }
}
