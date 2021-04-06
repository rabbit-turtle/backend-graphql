import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import {
  Room as RoomFromPrisma,
  RoomStatus as RoomStatusFromPrisma,
} from '@prisma/client';
import { CreateRoomInput } from './dto/input/create-room.input';
import { IServiceUpdateRoomInput } from './dto/input/update-room.input';
import { ROOM_STATUS_ID } from 'src/util/constans';

@Injectable()
export class RoomsService {
  constructor(private readonly prisma: PrismaService) {}

  async getRoomById(room_id: string): Promise<RoomFromPrisma> {
    return this.prisma.room.findUnique({ where: { id: room_id } });
  }

  async getRooms(user_id: string): Promise<RoomFromPrisma[]> {
    return await this.prisma.$queryRaw<RoomFromPrisma[]>`
      SELECT *
      FROM rooms
      WHERE rooms.inviter_id=${user_id} or rooms.receiver_id=${user_id}
      ORDER BY 
        (
          SELECT created_at FROM chats
          WHERE chats.room_id = rooms.id 
          ORDER BY created_at DESC
          LIMIT 1
        ) DESC,
        rooms.created_at DESC;
    `;
  }

  async getRoomStatus(room_status_id: number): Promise<RoomStatusFromPrisma> {
    return this.prisma.roomStatus.findUnique({ where: { id: room_status_id } });
  }

  async createRoom(
    inviter_id: string,
    createRoomData: CreateRoomInput,
  ): Promise<RoomFromPrisma> {
    return this.prisma.room.create({
      data: {
        ...createRoomData,
        location: createRoomData.location
          ? JSON.stringify(createRoomData.location)
          : null,
        inviter_id,
        room_status_id: ROOM_STATUS_ID.PROGRESS,
      },
    });
  }

  async updateRoom(
    room_id: string,
    updateRoomData: IServiceUpdateRoomInput,
  ): Promise<RoomFromPrisma> {
    const data = Object.assign(
      updateRoomData,
      updateRoomData.location && {
        location: JSON.stringify(updateRoomData.location),
      },
    );

    return this.prisma.room.update({
      where: { id: room_id },
      data,
    });
  }
}
