import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsObject, IsOptional } from 'class-validator';
import { CoordsInput } from 'src/rooms/model/Coords';

@InputType()
export class UpdateRoomInput {
  @Field()
  @IsNotEmpty()
  room_id: string;

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

export interface IServiceUpdateRoomInput {
  location?: CoordsInput;
  reserved_time?: Date;
  completed_time?: Date;
  room_status_id?: number;
  receiver_id?: string;
}
