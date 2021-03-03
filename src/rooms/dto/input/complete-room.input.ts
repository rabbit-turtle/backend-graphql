import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, Contains } from 'class-validator';

@InputType()
export class CompleteRoomInput {
  @Field()
  @IsNotEmpty()
  room_id: string;

  @Field()
  @IsNotEmpty()
  completed_time: Date;

  @Field()
  @IsNotEmpty()
  @Contains('longitude')
  @Contains('latitude')
  location: string;
}
