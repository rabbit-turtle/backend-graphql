import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { Chat as ChatFromPrisma } from '@prisma/client';
import { CreateChatInput } from './dto/input/create-chat.input';
import { GetChatsArgs } from './dto/args/get-chats.args';
import { Chat } from './model/Chat';

@Injectable()
export class ChatsService {
  constructor(private readonly prisma: PrismaService) {}

  async createChat(
    sender_id: string,
    createChatData: CreateChatInput,
  ): Promise<ChatFromPrisma> {
    return this.prisma.chat.create({
      data: {
        sender_id,
        ...createChatData,
      },
    });
  }

  async getChats(
    room_id: string,
    user_id: string,
    getChatsData: GetChatsArgs,
  ): Promise<Omit<Chat, 'sender'>[]> {
    const { offset, limit } = getChatsData;

    const chats = await this.prisma.chat.findMany({
      where: { room_id },
      orderBy: { created_at: 'desc' },
      take: limit,
      skip: offset,
    });

    return chats.map((chat) => ({
      ...chat,
      isSender: chat.sender_id === user_id,
    }));
  }
}
