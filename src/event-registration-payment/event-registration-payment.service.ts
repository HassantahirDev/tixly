import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateEventRegistrationPaymentDto } from './dto/create-event-registration-payment.dto';
import { PaymentStatus } from '@prisma/client';

@Injectable()
export class EventRegistrationPaymentService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    try {
      const Payment = await this.prisma.eventRegistrationPayment.findMany();
      return {
        success: true,
        data: Payment,
        message: 'Payments fetched successfully',
      };
    } catch (error) {
      throw new BadRequestException('Error fetching all records.');
    }
  }

 

  async findOne(id: string) {
    try {
      const Payment = await this.prisma.eventRegistrationPayment.findUnique({
        where: { id },
      });
      if (!Payment) {
        throw new NotFoundException(`Payment with id ${id} not found`);
      }
      return {
        success: true,
        data: Payment,
        message: 'Payment fetched successfully',
      };
    } catch (error) {
      throw error instanceof NotFoundException
        ? error
        : new BadRequestException('Error fetching record.');
    }
  }

  async create(data: CreateEventRegistrationPaymentDto) {
    try {
      const Payment = await this.prisma.eventRegistrationPayment.create({
        data,
      });
      return {
        success: true,
        data: Payment,
        message: 'Payment created successfully',
      };
    } catch (error) {
      throw new BadRequestException('Error creating record.');
    }
  }

  async update(id: string, data: CreateEventRegistrationPaymentDto) {
    try {
      const Payment = await this.prisma.eventRegistrationPayment.update({
        where: { id },
        data,
      });
      return {
        success: true,
        data: Payment,
        message: 'Payment updated successfully',
      };
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(
          `Payment with id: ${id} not found for update`,
        );
      }
      throw new BadRequestException('Error updating record.');
    }
  }

  async delete(id: string) {
    try {
      const Payment = await this.prisma.eventRegistrationPayment.delete({
        where: { id },
      });
      return {
        success: true,
        data: Payment,
        message: 'Payment deleted successfully',
      };
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(
          `Payment with id ${id} not found for deletion`,
        );
      }
      throw new BadRequestException('Error deleting record.');
    }
  }
}
