// src/channels/channels.service.ts
import { Injectable, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { ChannelsRepository } from './channels.repository';
import { CreateChannelDto } from './dto/create-channel.dto';
import { UpdateChannelDto } from './dto/update-channel.dto';
import { JoinChannelDto } from './dto/join-channel.dto';
import { UsersService } from '../users/users.service';
import { Channel } from './entities/channel.entity';
import { ChannelType } from '../common/enums/channel-type.enum';

@Injectable()
export class ChannelsService {
  constructor(
    private readonly channelsRepository: ChannelsRepository,
    private readonly usersService: UsersService,
  ) {}

  async createChannel(createChannelDto: CreateChannelDto, userId: number): Promise<Channel> {
    const user = await this.usersService.findOne(userId, ['channelMembers', 'messages', 'notifications']);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return this.channelsRepository.createChannel(createChannelDto, user as any); // Cast due to DTO
  }

  async findAll(): Promise<Channel[]> {
    return this.channelsRepository.findAll();
  }

  async findOne(id: number): Promise<Channel> {
    const channel = await this.channelsRepository.findOne(id);
    if (!channel) {
      throw new NotFoundException('Channel not found');
    }
    return channel;
  }

  async findByUser(userId: number): Promise<Channel[]> {
    return this.channelsRepository.findByUser(userId);
  }

  async updateChannel(id: number, updateChannelDto: UpdateChannelDto): Promise<Channel> {
    return this.channelsRepository.updateChannel(id, updateChannelDto);
  }

  async deleteChannel(id: number): Promise<void> {
    await this.channelsRepository.deleteChannel(id);
  }

  async joinChannel(joinChannelDto: JoinChannelDto, userId: number): Promise<Channel> {
    const user = await this.usersService.findOne(userId, ['channelMembers', 'messages', 'notifications']);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    const channel = await this.findOne(joinChannelDto.channelId);
    if (channel.type === ChannelType.Private) {
      throw new UnauthorizedException('Cannot join private channel without invitation');
    }
    return this.channelsRepository.addMember(joinChannelDto.channelId, user as any); // Cast due to DTO
  }

  async leaveChannel(channelId: number, userId: number): Promise<Channel> {
    const channel = await this.findOne(channelId);
    if (!channel.members.some((member) => member.user.id === userId)) {
      throw new NotFoundException('User is not a member of the channel');
    }
    return this.channelsRepository.removeMember(channelId, userId);
  }
}