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

  async getFeaturedEvents() {
    try {
      // Get events that:
      // 1. Are approved
      // 2. Have high capacity (>= 200)
      // 3. Have upcoming dates
      // 4. Have at least one comment or favorite
      // 5. Limit to 5 featured events
      const featuredEvents = await this.prisma.event.findMany({
        where: {
          AND: [
            { approvedByAdmin: true },
            { capacity: { gte: 200 } },
            { startTime: { gt: new Date() } },
            {
              OR: [
                { comments: { some: {} } },
                { favorites: { some: {} } }
              ]
            }
          ]
        },
        include: {
          comments: {
            include: {
              user: true,
              replies: {
                include: {
                  user: true
                }
              }
            }
          },
          favorites: true,
          _count: {
            select: {
              comments: true,
              favorites: true,
              TicketsPayment: true
            }
          },
          organizer: {
            select: {
              name: true,
              profilePic: true
            }
          },
          EventCategory: {
            select: {
              name: true,
              attachment: true
            }
          }
        },
        orderBy: [
          { capacity: 'desc' },
          { price: 'desc' }
        ],
        take: 1
      });

    

      // Calculate popularity score for each event
      const eventsWithScore = featuredEvents.map(event => ({
        ...event,
        popularityScore: 
          (event._count.comments * 2) + // Each comment counts as 2 points
          (event._count.favorites * 3) + // Each favorite counts as 3 points
          (event._count.TicketsPayment * 5) // Each ticket purchase counts as 5 points
      }));

      // Sort by popularity score
      eventsWithScore.sort((a, b) => b.popularityScore - a.popularityScore);

      return {
        success: true,
        data: eventsWithScore,
        message: 'Featured events fetched successfully'
      };
    } catch (error) {
      throw new BadRequestException('Error fetching featured events.');
    }
  }

  async getTopEventsByLocation(location: string, limit: number = 10) {
    try {
      // Validate location parameter
      if (!location) {
        throw new BadRequestException('Location parameter is required');
      }

      // Get events that:
      // 1. Match the location (case insensitive)
      // 2. Are approved and upcoming
      // 3. Include engagement metrics
      const topEvents = await this.prisma.event.findMany({
        where: {
          AND: [
            { 
              location: {
                contains: location,
                mode: 'insensitive'
              }
            },
            { approvedByAdmin: true },
            { startTime: { gt: new Date() } }
          ]
        },
        include: {
          _count: {
            select: {
              comments: true,
              favorites: true,
              TicketsPayment: true
            }
          },
          organizer: {
            select: {
              name: true,
              profilePic: true
            }
          },
          EventCategory: {
            select: {
              name: true,
              attachment: true
            }
          }
        },
        orderBy: [
          { 
            TicketsPayment: {
              _count: 'desc'
            }
          },
          { capacity: 'desc' }
        ],
        take: limit
      });

      // Calculate engagement score for ranking
      const eventsWithEngagement = topEvents.map(event => ({
        ...event,
        engagementScore: 
          (event._count.TicketsPayment * 10) + // Ticket sales have highest weight
          (event._count.favorites * 5) +        // Favorites are second
          (event._count.comments * 2),          // Comments have lowest weight
        availableCapacity: event.capacity - event._count.TicketsPayment // Calculate remaining tickets
      }));

      // Sort by engagement score
      eventsWithEngagement.sort((a, b) => b.engagementScore - a.engagementScore);

      return {
        success: true,
        data: eventsWithEngagement,
        message: `Top ${limit} events in ${location} fetched successfully`
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Error fetching top events by location.');
    }
  }
}
