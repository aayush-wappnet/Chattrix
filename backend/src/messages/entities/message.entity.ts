import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Channel } from '../../channels/entities/channel.entity';
import { MessageStatus } from '../../common/enums/message-status.enum';

@Entity()
export class Message {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  content: string;

  @ManyToOne(() => User, (user) => user.messages)
  sender: User;

  @ManyToOne(() => Channel, (channel) => channel.messages)
  channel: Channel;

  @Column({ type: 'enum', enum: MessageStatus, default: MessageStatus.Sent })
  status: MessageStatus;

  @CreateDateColumn()
  createdAt: Date;
}