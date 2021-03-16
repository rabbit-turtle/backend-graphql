import {
  UseGuards,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { Resolver, Query, Args, Context, Mutation } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { LoginByGoogleArgs } from './dto/input/login-by-google.input';
import { UserWithToken } from './model/UserWithToken';
import { CustomGraphQlContext } from 'src/app.module';
import { JwtAuthGuard } from './guard/jwt-auth.guard';
import { RedisService } from 'src/redis/redis.service';
import { CurrentUser } from './decorator/CurrentUser';
import { TokenPayload } from './model/TokenPayload';
import { UsersService } from 'src/users/users.service';

@Resolver()
export class AuthResolver {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
    private readonly redis: RedisService,
  ) {}

  @Query(() => UserWithToken, { nullable: true })
  async loginByGoogle(
    @Args() loginArgs: LoginByGoogleArgs,
    @Context() context: CustomGraphQlContext,
  ): Promise<UserWithToken> {
    const user = await this.authService.verifyByGoogle(loginArgs.google_token);
    const {
      access_token,
      expires_in,
      refresh_token,
    } = await this.authService.login(user.id);

    context.res.cookie('refresh_token', refresh_token);

    return {
      ...user,
      access_token,
      expires_in,
    };
  }

  @Query(() => UserWithToken, { nullable: true })
  @UseGuards(JwtAuthGuard)
  async refreshToken(
    @CurrentUser() currentUser: TokenPayload,
    @Context() context: CustomGraphQlContext,
  ) {
    const { id: userIdFromAccessToken } = currentUser;

    const refreshTokenFromRedis = await this.redis.get(userIdFromAccessToken);
    if (!refreshTokenFromRedis) throw new UnauthorizedException();

    const { refresh_token: refreshTokenFromCookie } = context.req.cookies;
    if (!refreshTokenFromCookie) throw new UnauthorizedException();

    if (refreshTokenFromRedis !== refreshTokenFromCookie)
      throw new ForbiddenException();

    const user = await this.usersService.getUser(userIdFromAccessToken);
    const {
      access_token,
      expires_in,
      refresh_token,
    } = await this.authService.refresh(user.id);

    context.res.cookie('refresh_token', refresh_token);

    return {
      ...user,
      access_token,
      expires_in,
    };
  }

  @Mutation(() => String)
  @UseGuards(JwtAuthGuard)
  async logoutFromAllDevices(@CurrentUser() currentUser: TokenPayload) {
    const { id } = currentUser;
    await this.redis.del(id);

    return 'logout succeed';
  }
}
