
import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateAdminDto } from "./dto/create-admin.dto";
import { PaymentStatus } from "@prisma/client";

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    try {
      const Admin = await this.prisma.admin.findMany();
      return {
        success: true,
        data: Admin,
        message: "Admins fetched successfully",
      };
    } catch (error) {
      throw new BadRequestException('Error fetching all records.');
    }
  }

  async approveEventRegistrationPayment(id: string) {
    console.log("EventRegistrationPaymentModule", id);
    const payment = await this.prisma.eventRegistrationPayment.findUnique({
      where: { id },
    });
    if (!payment) {
      throw new NotFoundException(`Payment with id ${id} not found`);
    }
    const paymentStatus = await this.prisma.eventRegistrationPayment.update({
      where: { id },
      data: { status: PaymentStatus.APPROVED },
    });
    const event = await this.prisma.event.update({
      where: {
        id: payment.eventId,
      },
      data: {
        approvedByAdmin: true,
      },
    });

    return {
      success: true,
      data: { paymentStatus, event },
      message: 'Payment approved & Event Registered successfully',
    };
  }

  async disapproveEventRegistrationPayment(id: string) {
    const payment = await this.prisma.eventRegistrationPayment.findUnique({
      where: { id },
    });
    
    if (!payment) {
      throw new NotFoundException(`Payment with id ${id} not found`);
    }

    const paymentStatus = await this.prisma.eventRegistrationPayment.update({
      where: { id },
      data: { status: PaymentStatus.REJECTED },
    });

    const event = await this.prisma.event.update({
      where: { id: payment.eventId },
      data: { approvedByAdmin: false },
    });

    return {
      success: true,
      data: { paymentStatus, event },
      message: 'Payment disapproved & Event Registration Rejected successfully',
    };
  }

  async findOne(id: string) {
    try {
      const Admin = await this.prisma.admin.findUnique({ where: { id } });
      if (!Admin) {
        throw new NotFoundException(`Admin with id ${id} not found`);
      }
      return {
        success: true,
        data: Admin,
        message: "Admin fetched successfully",
      };
    } catch (error) {
      throw error instanceof NotFoundException
        ? error
        : new BadRequestException('Error fetching record.');
    }
  }

  async create(data: CreateAdminDto) {
    try {
      const Admin = await this.prisma.admin.create({ data });
      return {
        success: true,
        data: Admin,
        message: "Admin created successfully",
      };
    } catch (error) {
      throw new BadRequestException('Error creating record.');
    }
  }

  async update(id: string, data: CreateAdminDto) {
    try {
      const Admin = await this.prisma.admin.update({ where: { id }, data });
      return {
        success: true,
        data: Admin,
        message: "Admin updated successfully",
      };
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Admin with id: ${id} not found for update`);
      }
      throw new BadRequestException('Error updating record.');
    }
  }

  async delete(id: string) {
    try {
      const Admin = await this.prisma.admin.delete({ where: { id } });
      return {
        success: true,
        data: Admin,
        message: "Admin deleted successfully",
      };
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Admin with id ${id} not found for deletion`);
      }
      throw new BadRequestException('Error deleting record.');
    }
  }
}
