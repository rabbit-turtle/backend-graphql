import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsObject, IsOptional } from 'class-validator';
import { CoordsInput } from 'src/rooms/model/Coords';

@InputType()
export class CreateRoomInput {
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
