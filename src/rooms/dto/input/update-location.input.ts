import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsObject } from 'class-validator';
import { CoordsInput } from 'src/rooms/model/Room';

@InputType()
export class UpdateLocationInput {
  @Field()
  @IsNotEmpty()
  room_id: string;

  @Field(() => CoordsInput)
  @IsObject()
  @IsNotEmpty()
  location: CoordsInput;
}
