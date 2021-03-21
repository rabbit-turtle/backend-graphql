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
import { CompleteRoomInput } from './dto/input/complete-room.input';
import { ROOM_STATUS_ID } from 'src/util/constans';
import { Chat } from 'src/chats/model/Chat';
import { ChatsService } from 'src/chats/chats.service';
import { GetChatsArgs } from 'src/chats/dto/args/get-chats.args';
import { Coords } from './model/Coords';
import { UpdateRoomInput } from './dto/input/update-room.input';

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

  @ResolveField('location', () => Coords, { nullable: true })
  location(@Parent() roomFromPrisma: RoomFromPrisma): Coords {
    const { location } = roomFromPrisma;
    return JSON.parse(location as string) as Coords;
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

  @ResolveField('recentChat', () => Chat, { nullable: true })
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

  @ResolveField('lastViewedChat', () => Chat, { nullable: true })
  async getLastViewedChat(
    @Parent() roomWithUserId: RoomWithUserId,
  ): Promise<Omit<Chat, 'sender'>> {
    const { id: room_id, user_id } = roomWithUserId;
    return this.chatsService.getLastViewedChat(room_id, user_id);
  }

  @ResolveField('chats', () => [Chat])
  async getChats(
    @Args() getChatsData: GetChatsArgs,
    @Parent() roomWithUserId: RoomWithUserId,
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
    return this.roomsService.createRoom(inviter_id, createRoomData);
  }

  @Mutation(() => Room)
  @UseGuards(JwtAuthGuard)
  async updateRoom(
    @CurrentUser() currentUser: TokenPayload,
    @Args('updateRoomData')
    updateRoomData: UpdateRoomInput,
  ): Promise<RoomFromPrisma> {
    const { id: inviter_id } = currentUser;
    const { room_id, reserved_time, location } = updateRoomData;

    const foundRoom = await this.roomsService.getRoomById(room_id);
    const isInviterSame = foundRoom.inviter_id === inviter_id;
    if (!isInviterSame) throw new ForbiddenException();

    return this.roomsService.updateRoom(room_id, {
      reserved_time,
      location,
    });
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
