
import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateEventCategoryDto } from "./dto/create-event-category.dto";

@Injectable()
export class EventCategoryService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    try {
      const EventCategory = await this.prisma.eventCategory.findMany({
        include: {
          events: {
            where: {
              approvedByAdmin: true,
              // startTime: {gt: new Date(new Date().setHours(new Date().getHours() + 1)) }, capacity: {gt: 0}
            },
          },
        },
      });
      return {
        success: true,
        data: EventCategory,
        message: "Event Categories fetched successfully",
      };
    } catch (error) {
      throw new BadRequestException('Error fetching all records.');
    }
  }

  async findOne(id: string) {
    try {
      const EventCategory = await this.prisma.eventCategory.findUnique({ where: { id } });
      if (!EventCategory) {
        throw new NotFoundException(`EventCategory with id ${id} not found`);
      }
      return {
        success: true,
        data: EventCategory,
        message: "EventCategory fetched successfully",
      };
    } catch (error) {
      throw error instanceof NotFoundException
        ? error
        : new BadRequestException('Error fetching record.');
    }
  }

  async create(data: CreateEventCategoryDto) {
    try {
      const EventCategory = await this.prisma.eventCategory.create({ data });
      return {
        success: true,
        data: EventCategory,
        message: "EventCategory created successfully",
      };
    } catch (error) {
      throw new BadRequestException('Error creating record.');
    }
  }

  async update(id: string, data: CreateEventCategoryDto) {
    try {
      const EventCategory = await this.prisma.eventCategory.update({ where: { id }, data });
      return {
        success: true,
        data: EventCategory,
        message: "EventCategory updated successfully",
      };
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`EventCategory with id: ${id} not found for update`);
      }
      throw new BadRequestException('Error updating record.');
    }
  }

  async delete(id: string) {
    try {
      const EventCategory = await this.prisma.eventCategory.delete({ where: { id } });
      return {
        success: true,
        data: EventCategory,
        message: "EventCategory deleted successfully",
      };
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`EventCategory with id ${id} not found for deletion`);
      }
      throw new BadRequestException('Error deleting record.');
    }
  }
}
