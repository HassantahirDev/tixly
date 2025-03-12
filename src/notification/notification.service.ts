
import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateNotificationDto } from "./dto/create-notification.dto";

@Injectable()
export class NotificationService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    try {
      const Notification = await this.prisma.notification.findMany();
      return {
        success: true,
        data: Notification,
        message: "Notifications fetched successfully",
      };
    } catch (error) {
      throw new BadRequestException('Error fetching all records.');
    }
  }

  async findOne(id: string) {
    try {
      const Notification = await this.prisma.notification.findUnique({ where: { id } });
      if (!Notification) {
        throw new NotFoundException(`Notification with id ${id} not found`);
      }
      return {
        success: true,
        data: Notification,
        message: "Notification fetched successfully",
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
        message: "Notification created successfully",
      };
    } catch (error) {
      throw new BadRequestException('Error creating record.');
    }
  }

  async update(id: string, data: CreateNotificationDto) {
    try {
      const Notification = await this.prisma.notification.update({ where: { id }, data });
      return {
        success: true,
        data: Notification,
        message: "Notification updated successfully",
      };
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Notification with id: ${id} not found for update`);
      }
      throw new BadRequestException('Error updating record.');
    }
  }

  async delete(id: string) {
    try {
      const Notification = await this.prisma.notification.delete({ where: { id } });
      return {
        success: true,
        data: Notification,
        message: "Notification deleted successfully",
      };
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Notification with id ${id} not found for deletion`);
      }
      throw new BadRequestException('Error deleting record.');
    }
  }
}
