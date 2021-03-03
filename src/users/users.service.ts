import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { User as UserFromPrisma } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async getUser(user_id: string): Promise<UserFromPrisma> {
    return this.prisma.user.findUnique({ where: { id: user_id } });
  }
}
