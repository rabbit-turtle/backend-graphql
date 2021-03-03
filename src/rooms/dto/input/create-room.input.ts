import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, Contains, IsOptional } from 'class-validator';
import { Room as RoomFromPrisma } from '@prisma/client';

@InputType()
export class CreateRoomInput
  implements Pick<RoomFromPrisma, 'title' | 'reserved_time' | 'location'> {
  @Field()
  @IsNotEmpty()
  title: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsNotEmpty()
  reserved_time: Date;

  @Field({ nullable: true })
  @IsOptional()
  @IsNotEmpty()
  @Contains('longitude')
  @Contains('latitude')
  location: string;
}
