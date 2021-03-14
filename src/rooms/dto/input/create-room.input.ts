import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsObject, IsOptional } from 'class-validator';
import { Room as RoomFromPrisma } from '@prisma/client';
import { CoordsInput } from 'src/rooms/model/Room';

@InputType()
export class CreateRoomInput
  implements Pick<RoomFromPrisma, 'title' | 'reserved_time'> {
  @Field()
  @IsNotEmpty()
  title: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsNotEmpty()
  reserved_time: Date;

  @Field(() => CoordsInput, { nullable: true })
  @IsObject()
  @IsNotEmpty()
  @IsOptional()
  location: CoordsInput;
}
