import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsNumber, IsOptional, Min, Max } from 'class-validator';
import { AllowedChatType } from '../../model/Chat';

@InputType()
export class CreateChatInput {
  @Field()
  @IsNotEmpty()
  id: string;

  @Field()
  @IsNotEmpty()
  room_id: string;

  @Field()
  @IsNotEmpty()
  content: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsNotEmpty()
  created_at: Date;

  @Field(() => AllowedChatType)
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @Max(4)
  chat_type_id: AllowedChatType;
}
