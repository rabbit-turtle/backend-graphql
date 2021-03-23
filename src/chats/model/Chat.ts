import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import { Chat as ChatFromPrisma } from '@prisma/client';
import { User } from 'src/users/model/User';

export enum AllowedChatType {
  NORMAL = 1,
  SUGGESTION = 2,
  SUGGESTION_CONFIRMED = 3,
  SUGGESTION_REFUSED = 4,
}

registerEnumType(AllowedChatType, {
  name: 'AllowedChatType',
});

@ObjectType()
export class Chat
  implements Omit<ChatFromPrisma, 'sender_id' | 'chat_type_id'> {
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

  @Field(() => AllowedChatType)
  chat_type_id: AllowedChatType;
}
