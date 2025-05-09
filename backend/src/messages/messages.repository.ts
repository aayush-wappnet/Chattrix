// src/messages/messages.repository.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from './entities/message.entity';
import { CreateMessageDto } from './dto/create-message.dto';
import { User } from '../users/entities/user.entity';
import { Channel } from '../channels/entities/channel.entity';
import { MessageStatus } from '../common/enums/message-status.enum';

@Injectable()
export class MessagesRepository {
  constructor(@InjectRepository(Message) private readonly messageRepository: Repository<Message>) {}

  async createMessage(createMessageDto: CreateMessageDto, sender: User, channel: Channel): Promise<Message> {
    const message = this.messageRepository.create({
      content: createMessageDto.content,
      sender,
      channel,
      status: MessageStatus.Sent,
    });
    return this.messageRepository.save(message);
  }

  async findByChannel(channelId: number): Promise<Message[]> {
    return this.messageRepository.find({
      where: { channel: { id: channelId } },
      relations: ['sender', 'channel'],
      select: {
        sender: {
          id: true,
          email: true,
          username: true,
          role: true,
          isOnline: true,
          lastSeen: true,
        },
      },
      order: { createdAt: 'ASC' },
    });
  }

  async updateStatus(messageId: number, status: MessageStatus): Promise<Message> {
    const message = await this.messageRepository.findOne({ where: { id: messageId } });
    if (!message) {
      throw new NotFoundException(`Message with ID ${messageId} not found`);
    }
    message.status = status;
    return this.messageRepository.save(message);
  }
}