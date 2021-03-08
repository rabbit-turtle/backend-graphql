import {
  Args,
  Query,
  Resolver,
  Mutation,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { ChatsService } from './chats.service';
import { Chat } from './model/Chat';
import { Chat as ChatFromPrisma, User as UserFromPrisma } from '@prisma/client';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { CreateChatInput } from './dto/input/create-chat.input';
import { CurrentUser } from 'src/auth/decorator/CurrentUser';
import { TokenPayload } from 'src/auth/model/TokenPayload';
import { User } from 'src/users/model/User';
import { UsersService } from 'src/users/users.service';
import { GetChatsArgs } from './dto/args/get-chats.args';

@Resolver(() => Chat)
export class ChatsResolver {
  constructor(
    private readonly chatsService: ChatsService,
    private readonly usersService: UsersService,
  ) {}

  @Query(() => [Chat], { name: 'chats', nullable: 'items' })
  @UseGuards(JwtAuthGuard)
  async getChats(
    @CurrentUser() currentUser: TokenPayload,
    @Args('room_id', { type: () => String }) room_id: string,
    @Args() getChatsArgs: GetChatsArgs,
  ): Promise<Omit<Chat, 'sender'>[]> {
    const { id: user_id } = currentUser;
    return this.chatsService.getChats(room_id, user_id, getChatsArgs);
  }

  @ResolveField('sender', () => User)
  async getSender(
    @Parent() chatFromPrisma: ChatFromPrisma,
  ): Promise<UserFromPrisma> {
    const { sender_id } = chatFromPrisma;
    return this.usersService.getUser(sender_id);
  }

  @Mutation(() => Chat)
  @UseGuards(JwtAuthGuard)
  async createChat(
    @CurrentUser() currentUser: TokenPayload,
    @Args('createChatData') createChatData: CreateChatInput,
  ) {
    const { id: sender_id } = currentUser;
    return this.chatsService.createChat(sender_id, createChatData);
  }
}
