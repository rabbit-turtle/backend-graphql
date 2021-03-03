import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, Contains } from 'class-validator';

@InputType()
export class UpdateLocationInput {
  @Field()
  @IsNotEmpty()
  room_id: string;

  @Field()
  @IsNotEmpty()
  @Contains('longitude')
  @Contains('latitude')
  location: string;
}
