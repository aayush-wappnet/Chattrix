// src/channels/dto/update-channel.dto.ts
import { IsString, IsOptional, IsEnum } from 'class-validator';
import { ChannelType } from '../../common/enums/channel-type.enum';

export class UpdateChannelDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsEnum(ChannelType)
  @IsOptional()
  type?: ChannelType;

  @IsString()
  @IsOptional()
  description?: string;
}