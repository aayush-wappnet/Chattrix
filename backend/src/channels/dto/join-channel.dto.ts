// src/channels/dto/join-channel.dto.ts
import { IsNumber } from 'class-validator';

export class JoinChannelDto {
  @IsNumber()
  channelId: number;
}