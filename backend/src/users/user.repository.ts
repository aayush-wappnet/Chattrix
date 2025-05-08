// src/users/user.repository.ts
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserRepository extends Repository<User> {
  constructor(@InjectRepository(User) private readonly repository: Repository<User>) {
    super(repository.target, repository.manager, repository.queryRunner);
  }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const user = this.repository.create(createUserDto);
    return this.repository.save(user);
  }

  async findById(id: number, relations: string[] = []): Promise<User | null> {
    return this.repository.findOne({
      where: { id },
      select: ['id', 'email', 'username', 'role', 'isOnline', 'lastSeen'],
      relations,
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.repository.findOne({ where: { email } }); // Includes password for auth
  }
}