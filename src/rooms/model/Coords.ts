import { Field, Float, ObjectType, InputType } from '@nestjs/graphql';

@ObjectType()
export class Coords {
  @Field(() => Float)
  longitude: number;

  @Field(() => Float)
  latitude: number;
}

@InputType()
export class CoordsInput {
  @Field(() => Float)
  longitude: number;

  @Field(() => Float)
  latitude: number;
}
