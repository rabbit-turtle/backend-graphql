import { Field, ObjectType } from '@nestjs/graphql';
import { User } from 'src/users/model/User';

@ObjectType()
export class UserWithToken extends User {
  @Field()
  token: string;
}
