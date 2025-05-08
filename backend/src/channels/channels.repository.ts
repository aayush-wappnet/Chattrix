// src/channels/channels.repository.ts
import { Repository } from 'typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Channel } from './entities/channel.entity';
import { ChannelMember } from './entities/channel-member.entity';
import { User } from '../users/entities/user.entity';
import { CreateChannelDto } from './dto/create-channel.dto';
import { UpdateChannelDto } from './dto/update-channel.dto';
import { ChannelType } from '../common/enums/channel-type.enum';

@Injectable()
export class ChannelsRepository {
  constructor(
    @InjectRepository(Channel)
    private readonly channelRepository: Repository<Channel>,
    @InjectRepository(ChannelMember)
    private readonly channelMemberRepository: Repository<ChannelMember>,
  ) {}

  async createChannel(createChannelDto: CreateChannelDto, user: User): Promise<Channel> {
    const channel = this.channelRepository.create({
      ...createChannelDto,
      type: createChannelDto.type || ChannelType.Public,
    });
    const savedChannel = await this.channelRepository.save(channel);
    const channelMember = this.channelMemberRepository.create({
      user,
      channel: savedChannel,
    });
    await this.channelMemberRepository.save(channelMember);
    return this.findOne(savedChannel.id);
  }

  async findAll(): Promise<Channel[]> {
    return this.channelRepository.find({
      relations: ['members', 'members.user'],
      relationLoadStrategy: 'query',
      select: {
        members: {
          id: true,
          joinedAt: true,
          user: {
            id: true,
            email: true,
            username: true,
            role: true,
            isOnline: true,
            lastSeen: true,
          },
        },
      },
    });
  }

  async findOne(id: number): Promise<Channel> {
    const channel = await this.channelRepository.findOne({
      where: { id },
      relations: ['members', 'members.user'],
      relationLoadStrategy: 'query',
      select: {
        members: {
          id: true,
          joinedAt: true,
          user: {
            id: true,
            email: true,
            username: true,
            role: true,
            isOnline: true,
            lastSeen: true,
          },
        },
      },
    });
    if (!channel) {
      throw new NotFoundException(`Channel with ID ${id} not found`);
    }
    return channel;
  }

  async findByUser(userId: number): Promise<Channel[]> {
    const channels = await this.channelRepository
      .createQueryBuilder('channel')
      .innerJoin('channel.members', 'member')
      .innerJoin('member.user', 'user', 'user.id = :userId', { userId })
      .getMany();
    return Promise.all(channels.map((channel) => this.findOne(channel.id)));
  }

  async updateChannel(id: number, updateChannelDto: UpdateChannelDto): Promise<Channel> {
    await this.channelRepository.update(id, updateChannelDto);
    return this.findOne(id);
  }

  async deleteChannel(id: number): Promise<void> {
    await this.channelMemberRepository.delete({ channel: { id } });
    await this.channelRepository.delete(id);
  }

  async addMember(channelId: number, user: User): Promise<Channel> {
    const channel = await this.findOne(channelId);
    const existingMember = await this.channelMemberRepository.findOne({
      where: { channel: { id: channelId }, user: { id: user.id } },
    });
    if (existingMember) {
      throw new Error('User is already a member of the channel');
    }
    const channelMember = this.channelMemberRepository.create({
      user,
      channel,
    });
    await this.channelMemberRepository.save(channelMember);
    return this.findOne(channelId);
  }

  async removeMember(channelId: number, userId: number): Promise<Channel> {
    const channel = await this.findOne(channelId);
    await this.channelMemberRepository.delete({
      channel: { id: channelId },
      user: { id: userId },
    });
    return this.findOne(channelId);
  }
}