import { Field, ObjectType } from '@nestjs/graphql';
import { Room as RoomFromPrisma } from '@prisma/client';
import { RoomStatus } from './RoomStatus';
import { User } from 'src/users/model/User';
import { Chat } from 'src/chats/model/Chat';
import { Coords } from './Coords';

@ObjectType()
export class Room
  implements
    Omit<
      RoomFromPrisma,
      'room_status_id' | 'receiver_id' | 'inviter_id' | 'location'
    > {
  @Field()
  id: string;

  @Field()
  title: string;

  @Field({ nullable: true })
  reserved_time: Date;

  @Field({ nullable: true })
  completed_time: Date;

  @Field()
  created_at: Date;

  @Field({ nullable: true })
  updated_at: Date;

  @Field({ nullable: true })
  deleted_at: Date;

  @Field(() => RoomStatus)
  roomStatus: RoomStatus;

  @Field(() => User, { nullable: true })
  receiver: User;

  @Field(() => User)
  inviter: User;

  @Field(() => Coords, { nullable: true })
  location: Coords;

  @Field(() => Chat, { nullable: true })
  recentChat: Chat;

  @Field(() => [Chat], { nullable: 'items' })
  chats: Chat[];

  @Field(() => Chat, { nullable: true })
  lastViewedChat: Chat;
}
