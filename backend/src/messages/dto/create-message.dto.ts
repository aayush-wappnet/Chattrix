// src/messages/dto/create-message.dto.ts
import { IsString, IsNumber } from 'class-validator';

export class CreateMessageDto {
  @IsString()
  content: string;

  @IsNumber()
  channelId: number;
}