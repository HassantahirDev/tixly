
import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateUserDto } from "./dto/create-user.dto";

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    try {
      const User = await this.prisma.user.findMany();
      return {
        success: true,
        data: User,
        message: "Users fetched successfully",
      };
    } catch (error) {
      throw new BadRequestException('Error fetching all records.');
    }
  }

  async findOne(id: string) {
    try {
      const User = await this.prisma.user.findUnique({ where: { id } });
      if (!User) {
        throw new NotFoundException(`User with id ${id} not found`);
      }
      return {
        success: true,
        data: User,
        message: "User fetched successfully",
      };
    } catch (error) {
      throw error instanceof NotFoundException
        ? error
        : new BadRequestException('Error fetching record.');
    }
  }

  async create(data: CreateUserDto) {
    try {
      const User = await this.prisma.user.create({ data });
      return {
        success: true,
        data: User,
        message: "User created successfully",
      };
    } catch (error) {
      throw new BadRequestException('Error creating record.');
    }
  }

  async update(id: string, data: CreateUserDto) {
    try {
      const User = await this.prisma.user.update({ where: { id }, data });
      return {
        success: true,
        data: User,
        message: "User updated successfully",
      };
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`User with id: ${id} not found for update`);
      }
      throw new BadRequestException('Error updating record.');
    }
  }

  async delete(id: string) {
    try {
      const User = await this.prisma.user.delete({ where: { id } });
      return {
        success: true,
        data: User,
        message: "User deleted successfully",
      };
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`User with id ${id} not found for deletion`);
      }
      throw new BadRequestException('Error deleting record.');
    }
  }
}
