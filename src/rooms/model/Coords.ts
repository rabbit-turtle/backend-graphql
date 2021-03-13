import { Field, Float, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Coords {
  @Field(() => Float)
  longitude: number;

  @Field(() => Float)
  latitude: number;
}
