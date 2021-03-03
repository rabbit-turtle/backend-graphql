import { ArgsType, Field } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

@ArgsType()
export class LoginByGoogleArgs {
  @Field()
  @IsNotEmpty()
  google_token: string;
}
