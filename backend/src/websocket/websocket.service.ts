// src/websocket/websocket.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { Socket } from 'socket.io';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { ChannelsService } from '../channels/channels.service';
import { UserResponseDto } from '../users/dto/user-response.dto';
import { plainToClass } from 'class-transformer';

@Injectable()
export class WebsocketService {
  private readonly logger = new Logger(WebsocketService.name);
  private userSocketMap: Map<number, string> = new Map(); // userId -> socketId

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly channelsService: ChannelsService,
  ) {}

  async authenticateClient(client: Socket): Promise<UserResponseDto> {
    this.logger.debug(`Authenticating client: ${client.id}`);
    let token = client.handshake.auth.token?.replace('Bearer ', '');
    if (!token) {
      token = client.handshake.headers.authorization?.replace('Bearer ', '');
    }
    if (!token) {
      this.logger.warn(`No token provided for client: ${client.id}`);
      client.emit('error', { message: 'No token provided' });
      throw new Error('No token provided');
    }
    try {
      this.logger.debug(`Verifying token: ${token.slice(0, 10)}...`);
      const secret = this.configService.get<string>('JWT_ACCESS_SECRET');
      if (!secret) {
        this.logger.error('JWT_ACCESS_SECRET not configured');
        client.emit('error', { message: 'Server configuration error' });
        throw new Error('JWT_ACCESS_SECRET not configured');
      }
      const payload = await this.jwtService.verifyAsync(token, { secret });
      this.logger.debug(`Token payload: ${JSON.stringify(payload)}`);
      const user = await this.usersService.findOne(payload.sub);
      if (!user) {
        this.logger.warn(`User not found for ID: ${payload.sub}`);
        client.emit('error', { message: `User not found: ${payload.sub}` });
        throw new Error(`User not found: ${payload.sub}`);
      }
      client.data.userId = user.id;
      this.logger.log(`Authenticated user: ${user.email} (ID: ${user.id})`);
      return user;
    } catch (error) {
      this.logger.error(`Authentication failed for client ${client.id}: ${error.message}`);
      client.emit('error', { message: `Authentication error: ${error.message}` });
      throw error;
    }
  }

  async handleConnection(client: Socket, user: UserResponseDto) {
    this.userSocketMap.set(user.id, client.id);
    await this.usersService.updatePresence(user.id, true);
    this.logger.log(`User ${user.email} connected with socket ID: ${client.id}`);
  }

  async handleDisconnect(client: Socket): Promise<UserResponseDto | null> {
    const userId = client.data.userId;
    if (!userId) {
      this.logger.warn('Disconnect attempt with no userId');
      return null;
    }
    this.userSocketMap.delete(userId);
    const user = await this.usersService.findOne(userId);
    if (user) {
      await this.usersService.updatePresence(userId, false);
      this.logger.log(`User ${user.email} disconnected`);
      return user;
    }
    return null;
  }

  async getActiveUsers(channelId: number): Promise<UserResponseDto[]> {
    const channel = await this.channelsService.findOne(channelId);
    if (!channel) {
      this.logger.warn(`Channel not found: ${channelId}`);
      return [];
    }
    const activeUsers: UserResponseDto[] = [];
    for (const [userId, socketId] of this.userSocketMap.entries()) {
      const user = await this.usersService.findOne(userId);
      if (user && channel.members.some((member) => member.user.id === userId)) {
        activeUsers.push(plainToClass(UserResponseDto, user));
      }
    }
    this.logger.debug(`Active users for channel ${channelId}: ${JSON.stringify(activeUsers)}`);
    return activeUsers;
  }
}