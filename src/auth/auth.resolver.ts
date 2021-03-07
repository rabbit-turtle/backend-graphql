import { UseGuards } from '@nestjs/common';
import { Resolver, Query, Args } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorator/CurrentUser';
import { LoginByGoogleArgs } from './dto/input/login-by-google.input';
import { JwtAuthGuard } from './guard/jwt-auth.guard';
import { Token } from './model/token';
import { TokenPayload } from './model/TokenPayload';

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

  @Query(() => Token, { nullable: true })
  async testerLogin(
    @Args('tester_id', { type: () => String }) tester_id: string,
  ): Promise<Token> {
    return {
      value: this.authService.testerLogin(tester_id),
    };
  }

  @Query(() => String, { nullable: true })
  @UseGuards(JwtAuthGuard)
  authTest(@CurrentUser() currentUser: TokenPayload) {
    const { id } = currentUser;
    console.log('id from client!', id);
    return `hello! ${id}`;
  }
}
