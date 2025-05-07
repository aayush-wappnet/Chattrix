// src/users/dto/create-user.dto.ts
import { IsEmail, IsString, MinLength, IsEnum } from 'class-validator';
import { Role } from '../../common/enums/role.enum';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  @MinLength(3)
  username: string;

  @IsEnum(Role)
  role: Role;
}