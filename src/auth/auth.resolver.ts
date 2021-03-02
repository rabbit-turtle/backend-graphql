import { Resolver, Query, Args } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { LoginByGoogleArgs } from './dto/login-by-google.input';
import { Token } from './model/token';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Query(() => Token, { nullable: true })
  async loginByGoogle(@Args() loginArgs: LoginByGoogleArgs): Promise<Token> {
    const user = await this.authService.verifyByGoogle(loginArgs.google_token);

    return {
      value: this.authService.login(user),
    };
  }
}
