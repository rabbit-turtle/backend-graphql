import { Field, Int, ObjectType } from '@nestjs/graphql';
import { User } from 'src/users/model/User';

@ObjectType()
export class UserWithToken extends User {
  @Field()
  access_token: string;

  @Field(() => Int)
  expires_in: number;
}
