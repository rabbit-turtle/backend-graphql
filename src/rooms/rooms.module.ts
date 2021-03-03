import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { PrismaService } from 'src/prisma.service';
import { UsersModule } from 'src/users/users.module';
import { RoomsResolver } from './rooms.resolver';
import { RoomsService } from './rooms.service';

@Module({
  imports: [AuthModule, UsersModule],
  providers: [PrismaService, RoomsService, RoomsResolver],
})
export class RoomsModule {}
