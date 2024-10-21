// src/users/users.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';  // Make sure the path to PrismaService is correct
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prismaService: PrismaService) {}

  // Create a new user
  async create(createUserDto: CreateUserDto) {
    return this.prismaService.user.create({
      data: createUserDto,
    });
  }

  // Get all users
  async findAll() {
    return this.prismaService.user.findMany();
  }

  // Get a specific user by ID
  async findOne(id: string) {
    const user = await this.prismaService.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  async getUserByEmail(email: string) {
    return await this.prismaService.user.findUnique({
      where: { email: email.toLowerCase(), deletedTime: null },
      include: { accounts: true },
    });
  }

  // Update a user
  async update(id: string, updateUserDto: UpdateUserDto) {
    const existingUser = await this.prismaService.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return this.prismaService.user.update({
      where: { id },
      data: updateUserDto,
    });
  }

  // Remove a user
  async remove(id: string) {
    const existingUser = await this.prismaService.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return this.prismaService.user.delete({
      where: { id },
    });
  }
}
