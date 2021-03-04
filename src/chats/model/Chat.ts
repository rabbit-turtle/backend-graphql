import { Field, ObjectType } from '@nestjs/graphql';
import { Chat as ChatFromPrisma } from '@prisma/client';
import { User } from 'src/users/model/User';

@ObjectType()
export class Chat implements Omit<ChatFromPrisma, 'sender_id'> {
  @Field()
  id: string;

  @Field()
  content: string;

  @Field()
  created_at: Date;

  @Field()
  room_id: string;

  @Field()
  isSender: boolean;

  @Field(() => User)
  sender: User;
}
