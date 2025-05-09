// src/channels/dto/create-channel.dto.ts
import { IsString, IsOptional, IsEnum, IsNumber } from 'class-validator';
import { ChannelType } from '../../common/enums/channel-type.enum';

export class CreateChannelDto {
  @IsString()
  name: string;

  @IsEnum(ChannelType)
  @IsOptional()
  type?: ChannelType;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @IsOptional()
  recipientId?: number; // For one-to-one private channels
}