// src/users/dto/user-response.dto.ts
import { IsNumber, IsString, IsEmail, IsBoolean, IsDate, IsEnum, IsOptional } from 'class-validator';
import { Role } from '../../common/enums/role.enum';

export class UserResponseDto {
  @IsNumber()
  id: number;

  @IsEmail()
  email: string;

  @IsString()
  username: string;

  @IsEnum(Role)
  role: Role;

  @IsBoolean()
  isOnline: boolean;

  @IsDate()
  @IsOptional()
  lastSeen: Date | null;
}