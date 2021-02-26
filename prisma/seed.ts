import { PrismaClient, RoomStatus, SocialLoginType } from '@prisma/client';

const prisma = new PrismaClient();

type RoomStatusName = Omit<RoomStatus, 'id'>;
type SocialLoginTypeName = Omit<SocialLoginType, 'id'>;

const ROOM_STATUS_NAMES: RoomStatusName[] = [
  { name: 'CANCELLED' },
  { name: 'PENDING' },
  { name: 'PROGRESS' },
  { name: 'DONE' },
];

const SOCIAL_LOGIN_TYPE_NAMES: SocialLoginTypeName[] = [
  { name: 'GOOGLE' },
  { name: 'KAKAO' },
];

const main = async () => {
  const createRoomStatus = ROOM_STATUS_NAMES.map(({ name }) =>
    prisma.roomStatus.create({ data: { name } }),
  );

  const createSocialLoginType = SOCIAL_LOGIN_TYPE_NAMES.map(({ name }) =>
    prisma.socialLoginType.create({ data: { name } }),
  );

  await prisma.$transaction(createRoomStatus);
  await prisma.$transaction(createSocialLoginType);
};

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => await prisma.$disconnect());
