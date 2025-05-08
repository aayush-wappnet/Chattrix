// src/websocket/websocket.gateway.ts
import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { WebsocketService } from './websocket.service';
import { Logger } from '@nestjs/common';

@WebSocketGateway({ cors: { origin: '*', methods: ['GET', 'POST'], credentials: true }, path: '/socket.io/' })
export class WebsocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(WebsocketGateway.name);

  constructor(private readonly websocketService: WebsocketService) {}

  async handleConnection(@ConnectedSocket() client: Socket) {
    this.logger.log(`Client attempting connection: ${client.id}`);
    try {
      const user = await this.websocketService.authenticateClient(client);
      if (!user) {
        this.logger.warn(`Authentication failed for client: ${client.id}`);
        client.emit('error', { message: 'Authentication failed' });
        client.disconnect(true);
        return;
      }
      await this.websocketService.handleConnection(client, user);
      this.server.emit('user-online', { userId: user.id, email: user.email });
      this.logger.log(`User ${user.email} connected`);
    } catch (error) {
      this.logger.error(`Connection error for client ${client.id}: ${error.message}`);
      client.emit('error', { message: `Server error: ${error.message}` });
      client.disconnect(true);
    }
  }

  async handleDisconnect(@ConnectedSocket() client: Socket) {
    this.logger.log(`Client disconnecting: ${client.id}`);
    const user = await this.websocketService.handleDisconnect(client);
    if (user) {
      this.server.emit('user-offline', { userId: user.id, email: user.email });
      this.logger.log(`User ${user.email} disconnected`);
    }
  }

  @SubscribeMessage('join-room')
  async handleJoinRoom(
    @MessageBody() data: { channelId: number },
    @ConnectedSocket() client: Socket,
  ) {
    const userId = client.data.userId;
    if (!userId) {
      this.logger.warn(`Unauthorized join-room attempt by client: ${client.id}`);
      client.emit('error', { message: 'Unauthorized: User not authenticated' });
      return;
    }
    client.join(`channel-${data.channelId}`);
    this.server.to(`channel-${data.channelId}`).emit('user-joined', { userId, channelId: data.channelId });
    this.logger.log(`User ${userId} joined channel ${data.channelId}`);
  }

  @SubscribeMessage('leave-room')
  async handleLeaveRoom(
    @MessageBody() data: { channelId: number },
    @ConnectedSocket() client: Socket,
  ) {
    const userId = client.data.userId;
    if (!userId) {
      this.logger.warn(`Unauthorized leave-room attempt by client: ${client.id}`);
      client.emit('error', { message: 'Unauthorized: User not authenticated' });
      return;
    }
    client.leave(`channel-${data.channelId}`);
    this.server.to(`channel-${data.channelId}`).emit('user-left', { userId, channelId: data.channelId });
    this.logger.log(`User ${userId} left channel ${data.channelId}`);
  }

  @SubscribeMessage('get-active-users')
  async handleGetActiveUsers(
    @MessageBody() data: { channelId: number },
    @ConnectedSocket() client: Socket,
  ) {
    const userId = client.data.userId;
    if (!userId) {
      this.logger.warn(`Unauthorized get-active-users attempt by client: ${client.id}`);
      client.emit('error', { message: 'Unauthorized: User not authenticated' });
      return;
    }
    const activeUsers = await this.websocketService.getActiveUsers(data.channelId);
    client.emit('active-users', { channelId: data.channelId, users: activeUsers });
    this.logger.log(`Sent active users for channel ${data.channelId} to user ${userId}`);
  }
}