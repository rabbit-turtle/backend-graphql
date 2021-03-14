import { UseGuards } from '@nestjs/common';
import { Resolver, Query, Args } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorator/CurrentUser';
import { LoginByGoogleArgs } from './dto/input/login-by-google.input';
import { JwtAuthGuard } from './guard/jwt-auth.guard';
import { UserWithToken } from './model/UserWithToken';
import { TokenPayload } from './model/TokenPayload';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Query(() => UserWithToken, { nullable: true })
  async loginByGoogle(
    @Args() loginArgs: LoginByGoogleArgs,
  ): Promise<UserWithToken> {
    const user = await this.authService.verifyByGoogle(loginArgs.google_token);

    return {
      ...user,
      token: this.authService.login(user),
    };
  }

  @Query(() => String, { nullable: true })
  @UseGuards(JwtAuthGuard)
  authTest(@CurrentUser() currentUser: TokenPayload) {
    const { id } = currentUser;
    console.log('id from client!', id);
    return `hello! ${id}`;
  }

  @Query(() => String, { nullable: true })
  testerLogin(@Args('id') id: string) {
    return this.authService.testerLogin(id);
  }
}
