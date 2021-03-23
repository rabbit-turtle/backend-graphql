import { Field, Int, ObjectType } from '@nestjs/graphql';
import { User as UserFromPrisma } from '@prisma/client';

@ObjectType()
export class User implements Omit<UserFromPrisma, 'social_id'> {
  @Field()
  id: string;

  @Field()
  name: string;

  @Field({ nullable: true })
  profile_url: string;

  @Field()
  created_at: Date;

  @Field({ nullable: true })
  updated_at: Date;

  @Field({ nullable: true })
  deleted_at: Date;

  @Field(() => Int)
  social_type_id: number;
}
