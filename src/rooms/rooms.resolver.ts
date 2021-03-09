import {
  Resolver,
  Query,
  Mutation,
  Args,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { User } from 'src/users/model/User';
import { Room } from './model/Room';
import { RoomStatus } from './model/RoomStatus';
import { RoomsService } from './rooms.service';
import {
  User as UserFromPrisma,
  Room as RoomFromPrisma,
  RoomStatus as RoomStatusFromPrisma,
} from '@prisma/client';
import { ForbiddenException, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { CurrentUser } from 'src/auth/decorator/CurrentUser';
import { TokenPayload } from 'src/auth/model/TokenPayload';
import { CreateRoomInput } from './dto/input/create-room.input';
import { UsersService } from 'src/users/users.service';
import { UpdateReservedTimeInput } from './dto/input/unpdate-reserved-time.input';
import { UpdateLocationInput } from './dto/input/update-location.input';
import { CompleteRoomInput } from './dto/input/complete-room.input';
import { ROOM_STATUS_ID } from 'src/util/constans';
import { Chat } from 'src/chats/model/Chat';
import { ChatsService } from 'src/chats/chats.service';
import { GetChatsArgs } from 'src/chats/dto/args/get-chats.args';

type RoomWithUserId = RoomFromPrisma & { user_id: string };

@Resolver(() => Room)
export class RoomsResolver {
  constructor(
    private readonly roomsService: RoomsService,
    private readonly usersService: UsersService,
    private readonly chatsService: ChatsService,
  ) {}

  @Query(() => [Room], { name: 'rooms', nullable: 'items' })
  @UseGuards(JwtAuthGuard)
  async getRooms(
    @CurrentUser() currentUser: TokenPayload,
  ): Promise<RoomWithUserId[]> {
    const { id: user_id } = currentUser;
    const rooms = await this.roomsService.getRooms(user_id);

    return rooms.map((room) => ({
      ...room,
      user_id,
    }));
  }

  @Query(() => Room, { name: 'room', nullable: true })
  @UseGuards(JwtAuthGuard)
  async getRoom(
    @CurrentUser() currentUser: TokenPayload,
    @Args('room_id', { type: () => String }) room_id: string,
  ): Promise<RoomWithUserId> {
    const { id: user_id } = currentUser;

    const room = await this.roomsService.getRoomById(room_id);
    return {
      ...room,
      user_id,
    };
  }

  @ResolveField('roomStatus', () => RoomStatus)
  async getRoomStatus(
    @Parent() roomFromPrisma: RoomFromPrisma,
  ): Promise<RoomStatusFromPrisma> {
    const { room_status_id } = roomFromPrisma;
    return this.roomsService.getRoomStatus(room_status_id);
  }

  @ResolveField('receiver', () => User, { nullable: true })
  async getReceiver(
    @Parent() roomFromPrimsa: RoomFromPrisma,
  ): Promise<UserFromPrisma> {
    const { receiver_id } = roomFromPrimsa;
    if (!receiver_id) return null;
    return this.usersService.getUser(receiver_id);
  }

  @ResolveField('recentChat', () => Chat)
  async getRecentChat(
    @Parent() roomWithUserId: RoomWithUserId,
  ): Promise<Omit<Chat, 'sender'>> {
    const { id: room_id, user_id } = roomWithUserId;
    const [recentChat] = await this.chatsService.getChats(room_id, user_id, {
      offset: 0,
      limit: 1,
    });

    return recentChat;
  }

  @ResolveField('chats', () => [Chat])
  async getChats(
    @Args() getChatsData: GetChatsArgs,
    @Parent()
    roomWithUserId: RoomWithUserId,
  ): Promise<Omit<Chat, 'sender'>[]> {
    const { id: room_id, user_id } = roomWithUserId;
    return this.chatsService.getChats(room_id, user_id, getChatsData);
  }

  @ResolveField('inviter', () => User)
  async getInviter(
    @Parent() roomFromPrimsa: RoomFromPrisma,
  ): Promise<UserFromPrisma> {
    const { inviter_id } = roomFromPrimsa;
    return this.usersService.getUser(inviter_id);
  }

  @Mutation(() => Room)
  @UseGuards(JwtAuthGuard)
  async createRoom(
    @CurrentUser() currentUser: TokenPayload,
    @Args('createRoomData') createRoomData: CreateRoomInput,
  ): Promise<RoomFromPrisma> {
    const { id: inviter_id } = currentUser;
    return this.roomsService.createRoom(createRoomData, inviter_id);
  }

  @Mutation(() => Room)
  @UseGuards(JwtAuthGuard)
  async updateReservedTime(
    @CurrentUser() currentUser: TokenPayload,
    @Args('updateReservedTimeData')
    updateReservedTimeData: UpdateReservedTimeInput,
  ): Promise<RoomFromPrisma> {
    const { id: inviter_id } = currentUser;
    const { room_id, reserved_time } = updateReservedTimeData;

    const foundRoom = await this.roomsService.getRoomById(room_id);
    const isInviterSame = foundRoom.inviter_id === inviter_id;
    if (!isInviterSame) throw new ForbiddenException();

    return this.roomsService.updateRoom(room_id, { reserved_time });
  }

  @Mutation(() => Room)
  @UseGuards(JwtAuthGuard)
  async updateLocation(
    @CurrentUser() currentUser: TokenPayload,
    @Args('updateLocationData')
    updateLocationData: UpdateLocationInput,
  ): Promise<RoomFromPrisma> {
    const { id: inviter_id } = currentUser;
    const { room_id, location } = updateLocationData;

    const foundRoom = await this.roomsService.getRoomById(room_id);
    const isInviterSame = foundRoom.inviter_id === inviter_id;
    if (!isInviterSame) throw new ForbiddenException();

    return this.roomsService.updateRoom(room_id, { location });
  }

  @Mutation(() => Room)
  @UseGuards(JwtAuthGuard)
  async completeRoom(
    @CurrentUser() currentUser: TokenPayload,
    @Args('completeRoomData')
    completeRoomData: CompleteRoomInput,
  ): Promise<RoomFromPrisma> {
    const { id: inviter_id } = currentUser;
    const { room_id, location, completed_time } = completeRoomData;

    const foundRoom = await this.roomsService.getRoomById(room_id);
    const isInviterSame = foundRoom.inviter_id === inviter_id;
    if (!isInviterSame) throw new ForbiddenException();

    return this.roomsService.updateRoom(room_id, {
      location,
      completed_time,
      room_status_id: ROOM_STATUS_ID.DONE,
    });
  }

  @Mutation(() => Room)
  @UseGuards(JwtAuthGuard)
  async cancleRoom(
    @CurrentUser() currentUser: TokenPayload,
    @Args('room_id', { type: () => String }) room_id: string,
  ): Promise<RoomFromPrisma> {
    const { id: inviter_id } = currentUser;

    const foundRoom = await this.roomsService.getRoomById(room_id);
    const isInviterSame = foundRoom.inviter_id === inviter_id;
    if (!isInviterSame) throw new ForbiddenException();

    return this.roomsService.updateRoom(room_id, {
      room_status_id: ROOM_STATUS_ID.CANCELLED,
    });
  }

  @Mutation(() => Room)
  @UseGuards(JwtAuthGuard)
  async saveReceiver(
    @CurrentUser() currentUser: TokenPayload,
    @Args('room_id', { type: () => String }) room_id: string,
  ): Promise<RoomFromPrisma> {
    const { id: receiver_id } = currentUser;
    return this.roomsService.updateRoom(room_id, { receiver_id });
  }
}
