import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Channel } from './channel.entity';

@Entity()
export class ChannelMember {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.channelMembers)
  user: User;

  @ManyToOne(() => Channel, (channel) => channel.members)
  channel: Channel;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  joinedAt: Date;
}