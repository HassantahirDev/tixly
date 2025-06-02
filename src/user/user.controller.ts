
import { Controller, Get, Post, Body, Param, Delete, Put } from "@nestjs/common";
import { UserService } from "./user.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UpdateUserDto } from "./dto/update-user.dto";

@ApiTags('User')
@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new User' })
  @ApiResponse({ status: 201, description: 'The User has been successfully created.' })
  create(@Body() createDto: CreateUserDto) {
    return this.userService.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all Users' })
  @ApiResponse({ status: 200, description: 'List of all Users.' })
  findAll() {
    return this.userService.findAll();
  }

  @Get(":id")
  @ApiOperation({ summary: 'Get a User by ID' })
  @ApiResponse({ status: 200, description: 'The User with the given ID.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  findOne(@Param("id") id: string) {
    return this.userService.findOne(id);
  }

  @Put(":id")
  @ApiOperation({ summary: 'Update a User by ID' })
  @ApiResponse({ status: 200, description: 'The User has been successfully updated.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  update(@Param("id") id: string, @Body() updateDto: UpdateUserDto) {
    return this.userService.update(id, updateDto);
  }

  @Delete(":id")
  @ApiOperation({ summary: 'Delete a User by ID' })
  @ApiResponse({ status: 200, description: 'The User has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  remove(@Param("id") id: string) {
    return this.userService.delete(id);
  }
}
