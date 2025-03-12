
import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateAdminBankDetailsDto } from "./dto/create-admin-bank-details.dto";

@Injectable()
export class AdminBankDetailsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    try {
      const AdminBankDetails = await this.prisma.adminBankDetails.findMany();
      return {
        success: true,
        data: AdminBankDetails,
        message: "AdminBankDetails fetched successfully",
      };
    } catch (error) {
      throw new BadRequestException('Error fetching all records.');
    }
  }

  async findOne(id: string) {
    try {
      const AdminBankDetails = await this.prisma.adminBankDetails.findUnique({ where: { id } });
      if (!AdminBankDetails) {
        throw new NotFoundException(`AdminBankDetails with id ${id} not found`);
      }
      return {
        success: true,
        data: AdminBankDetails,
        message: "AdminBankDetails fetched successfully",
      };
    } catch (error) {
      throw error instanceof NotFoundException
        ? error
        : new BadRequestException('Error fetching record.');
    }
  }

  async create(data: CreateAdminBankDetailsDto) {
    try {
      const AdminBankDetails = await this.prisma.adminBankDetails.create({ data });
      return {
        success: true,
        data: AdminBankDetails,
        message: "AdminBankDetails created successfully",
      };
    } catch (error) {
      throw new BadRequestException('Error creating record.');
    }
  }

  async update(id: string, data: CreateAdminBankDetailsDto) {
    try {
      const AdminBankDetails = await this.prisma.adminBankDetails.update({ where: { id }, data });
      return {
        success: true,
        data: AdminBankDetails,
        message: "AdminBankDetails updated successfully",
      };
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`AdminBankDetails with id: ${id} not found for update`);
      }
      throw new BadRequestException('Error updating record.');
    }
  }

  async delete(id: string) {
    try {
      const AdminBankDetails = await this.prisma.adminBankDetails.delete({ where: { id } });
      return {
        success: true,
        data: AdminBankDetails,
        message: "AdminBankDetails deleted successfully",
      };
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`AdminBankDetails with id ${id} not found for deletion`);
      }
      throw new BadRequestException('Error deleting record.');
    }
  }
}
