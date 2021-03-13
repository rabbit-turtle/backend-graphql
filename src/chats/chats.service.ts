import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateChatInput } from './dto/input/create-chat.input';
import { GetChatsArgs } from './dto/args/get-chats.args';
import { Chat } from './model/Chat';
import { SaveLastViewedChatInput } from './dto/input/save-last-viewed-chat.input';

@Injectable()
export class ChatsService {
  constructor(private readonly prisma: PrismaService) {}

  async createChat(
    sender_id: string,
    createChatData: CreateChatInput,
  ): Promise<Omit<Chat, 'sender'>> {
    const createdChat = await this.prisma.chat.create({
      data: {
        sender_id,
        ...createChatData,
      },
    });

    return {
      ...createdChat,
      isSender: createdChat.sender_id === sender_id,
    };
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

    return chats
      .map((chat) => ({
        ...chat,
        isSender: chat.sender_id === user_id,
      }))
      .sort((a, b) => a.created_at.getTime() - b.created_at.getTime());
  }

  async getLastViewedChat(
    room_id: string,
    user_id: string,
  ): Promise<Omit<Chat, 'sender'> | null> {
    const foundChat = await this.prisma.lastViewedChat
      .findUnique({
        where: {
          user_id_room_id: {
            user_id,
            room_id,
          },
        },
      })
      .chat();

    if (!foundChat) return null;

    return {
      ...foundChat,
      isSender: foundChat.sender_id === user_id,
    };
  }

  async saveLastViewedChat(
    user_id: string,
    saveLastViedChatData: SaveLastViewedChatInput,
  ): Promise<Omit<Chat, 'sender'>> {
    const savedLastViewdChat = await this.prisma.lastViewedChat
      .upsert({
        where: {
          user_id_room_id: {
            user_id,
            room_id: saveLastViedChatData.room_id,
          },
        },
        update: { chat_id: saveLastViedChatData.chat_id },
        create: { user_id, ...saveLastViedChatData },
      })
      .chat();

    return {
      ...savedLastViewdChat,
      isSender: savedLastViewdChat.sender_id === user_id,
    };
  }
}
