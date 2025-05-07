// src/users/users.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UserRepository) {}

  async create(createUserDto: CreateUserDto) {
    return this.userRepository.createUser(createUserDto);
  }

  async findOne(id: number) {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return {
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
      isOnline: user.isOnline,
      lastSeen: user.lastSeen,
    };
  }

  async findByEmail(email: string) {
    return this.userRepository.findByEmail(email);
  }
}