
import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateOrganizerBankDetailsDto } from "./dto/create-bank-details.dto";

@Injectable()
export class BankDetailsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    try {
      const BankDetails = await this.prisma.organizerBankDetails.findMany();
      return {
        success: true,
        data: BankDetails,
        message: "Bank Details fetched successfully",
      };
    } catch (error) {
      throw new BadRequestException('Error fetching all records.');
    }
  }

  async findOne(id: string) {
    try {
      const BankDetails = await this.prisma.organizerBankDetails.findUnique({ where: { id } });
      if (!BankDetails) {
        throw new NotFoundException(`BankDetails with id ${id} not found`);
      }
      return {
        success: true,
        data: BankDetails,
        message: "BankDetails fetched successfully",
      };
    } catch (error) {
      throw error instanceof NotFoundException
        ? error
        : new BadRequestException('Error fetching record.');
    }
  }

  async create(data: CreateOrganizerBankDetailsDto) {
    try {
      const BankDetails = await this.prisma.organizerBankDetails.create({ data });
      return {
        success: true,
        data: BankDetails,
        message: "BankDetails created successfully",
      };
    } catch (error) {
      throw new BadRequestException('Error creating record.');
    }
  }

  async update(id: string, data: CreateOrganizerBankDetailsDto) {
    try {
      const BankDetails = await this.prisma.organizerBankDetails.update({ where: { id }, data });
      return {
        success: true,
        data: BankDetails,
        message: "BankDetails updated successfully",
      };
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`BankDetails with id: ${id} not found for update`);
      }
      throw new BadRequestException('Error updating record.');
    }
  }

  async delete(id: string) {
    try {
      const BankDetails = await this.prisma.organizerBankDetails.delete({ where: { id } });
      return {
        success: true,
        data: BankDetails,
        message: "BankDetails deleted successfully",
      };
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`BankDetails with id ${id} not found for deletion`);
      }
      throw new BadRequestException('Error deleting record.');
    }
  }
}
