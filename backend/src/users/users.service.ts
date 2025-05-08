// src/users/users.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { CreateUserDto } from './dto/create-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { User } from './entities/user.entity';
import { plainToClass } from 'class-transformer';

@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UserRepository) {}

  async create(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    const user = await this.userRepository.createUser(createUserDto);
    return plainToClass(UserResponseDto, user);
  }

  async findOne(id: number, relations: string[] = []): Promise<UserResponseDto> {
    const user = await this.userRepository.findById(id, relations);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return plainToClass(UserResponseDto, user);
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user; // Includes password for authentication
  }

  async updatePresence(id: number, isOnline: boolean): Promise<void> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    user.isOnline = isOnline;
    user.lastSeen = isOnline ? null : new Date();
    await this.userRepository.save(user);
  }
}