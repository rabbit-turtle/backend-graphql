import { ArgsType, Field, Int } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional } from 'class-validator';

@ArgsType()
export class GetChatsArgs {
  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsNotEmpty()
  offset: number;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsNotEmpty()
  limit: number;
}
