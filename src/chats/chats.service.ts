import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { Chat as ChatFromPrisma } from '@prisma/client';
import { CreateChatInput } from './dto/input/create-chat.input';

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

  async getChats(room_id: string): Promise<ChatFromPrisma[]> {
    return this.prisma.chat.findMany({
      where: { room_id },
      orderBy: { created_at: 'desc' },
    });
  }
}
