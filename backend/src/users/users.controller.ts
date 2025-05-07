// src/users/users.controller.ts
import { Controller, Get, Param, UseGuards, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  async getCurrentUser(@Request() req: any) {
    return this.usersService.findOne(req.user.id);
  }

  @Get(':id')
  @UseGuards(RolesGuard)
  @Roles(Role.Admin)
  async getUserById(@Param('id') id: number) {
    return this.usersService.findOne(id);
  }
}