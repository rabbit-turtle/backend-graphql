import { Field, Int, ObjectType } from '@nestjs/graphql';
import { RoomStatus as RoomStatusFromPrisma } from '@prisma/client';

@ObjectType()
export class RoomStatus implements RoomStatusFromPrisma {
  @Field(() => Int)
  id: number;

  @Field()
  name: string;
}
