import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTicketPaymentDto } from './dto/create-ticket-payment.dto';
import { UpdateTicketPaymentDto } from './dto/update-ticket-payment.dto';
import { NotificationService } from 'src/notification/notification.service';

@Injectable()
export class TicketsPaymentService {
  constructor(private prisma: PrismaService, private notificationService: NotificationService) {}

  async findAll() {
    try {
      const TicketsPayment = await this.prisma.ticketsPayment.findMany();
      return {
        success: true,
        data: TicketsPayment,
        message: 'TicketsPayments fetched successfully',
      };
    } catch (error) {
      throw new BadRequestException('Error fetching all records.');
    }
  }

   async findAllTicketPaymentOfAUser(userId: string) {
    try {
      const TicketsPayment = await this.prisma.ticketsPayment.findMany({
        where: { userId },
        include:{
          Event: true,
          User: true
        }
      });
      return {
        success: true,
        data: TicketsPayment,
        message: 'TicketsPayments fetched successfully',
      };
    } catch (error) {
      throw new BadRequestException('Error fetching all records.');
    }
  }

  async findOne(id: string) {
    try {
      const TicketsPayment = await this.prisma.ticketsPayment.findUnique({
        where: { id },
      });
      if (!TicketsPayment) {
        throw new NotFoundException(`TicketsPayment with id ${id} not found`);
      }
      return {
        success: true,
        data: TicketsPayment,
        message: 'TicketsPayment fetched successfully',
      };
    } catch (error) {
      throw error instanceof NotFoundException
        ? error
        : new BadRequestException('Error fetching record.');
    }
  }

  async create(data: CreateTicketPaymentDto, userId: string) {
    try {
      let event;
      event = await this.prisma.event.findUnique({
        where: { id: data.eventId },
      });
      if (!event) {
        throw new NotFoundException(`Event with id ${data.eventId} not found`);
      }
      if (event.capacity <= 0) {
        throw new BadRequestException('Event is fully booked');
      }
      const totalAmount = event.price * data.quantity;
      console.log('totalAmount', totalAmount);
      const TicketsPayment = await this.prisma.ticketsPayment.create({
        data: { ...data, userId, amount: totalAmount },
      });
      await this.prisma.event.update({
        where: { id: data.eventId },
        data: { capacity: { decrement: data.quantity } },
      });

      await this.notificationService.create({
        userId,
        eventId: data.eventId,
        message: `You have successfully purchased ${data.quantity} tickets for the event "${event.title}". Total amount: ${totalAmount}`,
      });

      return {
        success: true,
        data: { TicketsPayment, event },
        message: 'TicketsPayment created successfully',
      };
    } catch (error) {
      throw new BadRequestException('Error creating record.');
    }
  }

  async update(id: string, data: UpdateTicketPaymentDto) {
    try {
      const TicketsPayment = await this.prisma.ticketsPayment.update({
        where: { id },
        data,
      });
      return {
        success: true,
        data: TicketsPayment,
        message: 'TicketsPayment updated successfully',
      };
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(
          `TicketsPayment with id: ${id} not found for update`,
        );
      }
      throw new BadRequestException('Error updating record.');
    }
  }

  async delete(id: string) {
    try {
      const TicketsPayment = await this.prisma.ticketsPayment.delete({
        where: { id },
      });
      return {
        success: true,
        data: TicketsPayment,
        message: 'TicketsPayment deleted successfully',
      };
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(
          `TicketsPayment with id ${id} not found for deletion`,
        );
      }
      throw new BadRequestException('Error deleting record.');
    }
  }
}
