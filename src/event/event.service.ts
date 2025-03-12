import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateEventDto } from './dto/create-event.dto';
import e from 'express';

@Injectable()
export class EventService {
  constructor(private prisma: PrismaService) {}

  async findAll(userId: string) {
    try {
      const user = await this.prisma.user.findUnique({ where: { id: userId } });
      let events;
      if (user) {
        events = await this.prisma.event.findMany({
          where: {
            approvedByAdmin: true,
            startTime: {gt: new Date(new Date().setHours(new Date().getHours() + 1)) }, capacity: {gt: 0}
          },
        });
      } else {
        events = await this.prisma.event.findMany();
      }

      return {
        success: true,
        data: events,
        message: 'Events fetched successfully',
      };
    } catch (error) {
      throw new BadRequestException('Error fetching all records.');
    }
  }

  async searchEvents(query: string) {
    try {
      const events = await this.prisma.event.findMany({
        where: {
          OR: [
            { title: { contains: query, mode: 'insensitive' } },
            { description: { contains: query, mode: 'insensitive' } },
            // { location: { contains: query, mode: 'insensitive' } },
          ],
        },
      });

      return {
        success: true,
        data: events,
        message: 'Events fetched successfully',
      };
    } catch (error) {
      throw new BadRequestException('Error fetching events.');
    }
  }

  async findOne(id: string, userId: string) {
    try {
      const user = await this.prisma.user.findUnique({ where: { id: userId } });
      let event;
      if (user) {
        event = await this.prisma.event.findUnique({
          where: { id, approvedByAdmin: true, startTime: {gt: new Date(new Date().setHours(new Date().getHours() + 1)) }, capacity: {gt: 0} },
        });
      } else {
        event = await this.prisma.event.findUnique({ where: { id } });
      }

      if (!event) {
        throw new NotFoundException(`Event not found`);
      }
      return {
        success: true,
        data: event,
        message: 'Event fetched successfully',
      };
    } catch (error) {
      throw error instanceof NotFoundException
        ? error
        : new BadRequestException('Error fetching record.');
    }
  }

  async create(data: CreateEventDto) {
    try {
      const Event = await this.prisma.event.create({ data });
      return {
        success: true,
        data: Event,
        message: 'Event created successfully',
      };
    } catch (error) {
      throw new BadRequestException('Error creating record.');
    }
  }

  async update(id: string, data: CreateEventDto) {
    try {
      const Event = await this.prisma.event.update({ where: { id }, data });
      return {
        success: true,
        data: Event,
        message: 'Event updated successfully',
      };
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(
          `Event with id: ${id} not found for update`,
        );
      }
      throw new BadRequestException('Error updating record.');
    }
  }

  async delete(id: string) {
    try {
      const Event = await this.prisma.event.delete({ where: { id } });
      return {
        success: true,
        data: Event,
        message: 'Event deleted successfully',
      };
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(
          `Event with id ${id} not found for deletion`,
        );
      }
      throw new BadRequestException('Error deleting record.');
    }
  }
}
