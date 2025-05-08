// src/channels/channels.controller.ts
import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards, Req } from '@nestjs/common';
import { ChannelsService } from './channels.service';
import { CreateChannelDto } from './dto/create-channel.dto';
import { UpdateChannelDto } from './dto/update-channel.dto';
import { JoinChannelDto } from './dto/join-channel.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Channel } from './entities/channel.entity';

@Controller('channels')
@UseGuards(JwtAuthGuard)
export class ChannelsController {
  constructor(private readonly channelsService: ChannelsService) {}

  @Post()
  create(@Body() createChannelDto: CreateChannelDto, @Req() req): Promise<Channel> {
    return this.channelsService.createChannel(createChannelDto, req.user.id);
  }

  @Get()
  findAll(): Promise<Channel[]> {
    return this.channelsService.findAll();
  }

  @Get('my')
  findMyChannels(@Req() req): Promise<Channel[]> {
    return this.channelsService.findByUser(req.user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Channel> {
    return this.channelsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateChannelDto: UpdateChannelDto): Promise<Channel> {
    return this.channelsService.updateChannel(+id, updateChannelDto);
  }

  @Delete(':id')
  delete(@Param('id') id: string): Promise<void> {
    return this.channelsService.deleteChannel(+id);
  }

  @Post('join')
  join(@Body() joinChannelDto: JoinChannelDto, @Req() req): Promise<Channel> {
    return this.channelsService.joinChannel(joinChannelDto, req.user.id);
  }

  @Post('leave/:id')
  leave(@Param('id') id: string, @Req() req): Promise<Channel> {
    return this.channelsService.leaveChannel(+id, req.user.id);
  }
}