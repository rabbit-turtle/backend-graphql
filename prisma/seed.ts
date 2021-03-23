import {
  PrismaClient,
  RoomStatus,
  SocialLoginType,
  User,
  ChatType,
} from '@prisma/client';

const prisma = new PrismaClient();

type RoomStatusName = Omit<RoomStatus, 'id'>;
type SocialLoginTypeName = Omit<SocialLoginType, 'id'>;
type ChatTypeName = Omit<ChatType, 'id'>;
type Tester = Pick<User, 'name' | 'social_id' | 'social_type_id'>;

const ROOM_STATUS_NAMES: RoomStatusName[] = [
  { name: 'PROGRESS' },
  { name: 'PENDING' },
  { name: 'CANCELLED' },
  { name: 'DONE' },
];

const SOCIAL_LOGIN_TYPE_NAMES: SocialLoginTypeName[] = [
  { name: 'GOOGLE' },
  { name: 'KAKAO' },
];

const CHAT_TYPES_NAMES: ChatTypeName[] = [
  { name: 'NORMAL' },
  { name: 'SUGGESTION' },
  { name: 'SUGGESTION_CONFIRMED' },
  { name: 'SUGGESTION_REFUSED' },
];

const TESTERS: Tester[] = [
  { name: 'rabbit', social_id: '123', social_type_id: 1 },
  { name: 'turtle', social_id: '456', social_type_id: 1 },
];

const main = async () => {
  const createRoomStatus = ROOM_STATUS_NAMES.map(({ name }) =>
    prisma.roomStatus.create({ data: { name } }),
  );

  const createSocialLoginType = SOCIAL_LOGIN_TYPE_NAMES.map(({ name }) =>
    prisma.socialLoginType.create({ data: { name } }),
  );

  const createChatType = CHAT_TYPES_NAMES.map(({ name }) =>
    prisma.chatType.create({ data: { name } }),
  );

  const createTesters = TESTERS.map((tester) =>
    prisma.user.create({ data: tester }),
  );

  await prisma.$transaction(createRoomStatus);
  await prisma.$transaction(createSocialLoginType);
  await prisma.$transaction(createChatType);
  await prisma.$transaction(createTesters);
};

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => await prisma.$disconnect());
