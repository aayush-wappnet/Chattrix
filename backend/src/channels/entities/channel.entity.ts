import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { ChannelType } from '../../common/enums/channel-type.enum';
import { ChannelMember } from '../../channels/entities/channel-member.entity';
import { Message } from '../../messages/entities/message.entity';

@Entity()
export class Channel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'enum', enum: ChannelType, default: ChannelType.Public })
  type: ChannelType;

  @Column({ nullable: true })
  description: string;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @OneToMany(() => ChannelMember, (channelMember) => channelMember.channel)
  members: ChannelMember[];

  @OneToMany(() => Message, (message) => message.channel)
  messages: Message[];
}