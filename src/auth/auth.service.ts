import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { TokenPayload } from './model/TokenPayload';
import { OAuth2Client } from 'google-auth-library';
import { SOCIAL_TYPE_ID } from '../util/constans';
import { RedisService } from 'src/redis/redis.service';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
  ) {}

  async verifyByGoogle(googleToken: string): Promise<User> {
    const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
    const ticket = await client.verifyIdToken({
      idToken: googleToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { sub, name, picture } = payload;

    const foundUser = await this.prisma.user.findUnique({
      where: {
        social_id_social_type_id: {
          social_id: sub,
          social_type_id: SOCIAL_TYPE_ID.GOOGLE,
        },
      },
    });

    if (foundUser) return foundUser;

    return this.prisma.user.create({
      data: {
        social_id: sub,
        social_type_id: SOCIAL_TYPE_ID.GOOGLE,
        name,
        profile_url: picture,
      },
    });
  }

  async login(
    user_id: string,
  ): Promise<{
    access_token: string;
    expires_in: number;
    refresh_token: string;
  }> {
    const payload: TokenPayload = { id: user_id };
    const access_token = this.jwtService.sign(payload);

    let refresh_token = await this.redis.get(user_id);
    if (!refresh_token) {
      refresh_token = this.jwtService.sign(payload, {
        secret: process.env.REFRESH_TOKEN_SALT,
      });
      await this.redis.set(user_id, refresh_token);
    }

    return {
      access_token,
      expires_in: Number(process.env.ACCESS_TOKEN_EXPIRES_IN),
      refresh_token,
    };
  }

  async refresh(
    user_id: string,
  ): Promise<{
    access_token: string;
    expires_in: number;
    refresh_token: string;
  }> {
    const payload: TokenPayload = { id: user_id };
    const access_token = this.jwtService.sign(payload);

    // const refresh_token = this.jwtService.sign(payload, {
    //   secret: process.env.REFRESH_TOKEN_SALT,
    //   expiresIn: '365d',
    // });
    const refresh_token = jwt.sign(payload, process.env.REFRESH_TOKEN_SALT);
    await this.redis.set(user_id, refresh_token);

    return {
      access_token,
      expires_in: Number(process.env.ACCESS_TOKEN_EXPIRES_IN),
      refresh_token,
    };
  }

  verifyRefreshToken(refresh_token: string) {
    const { id } = jwt.verify(
      refresh_token,
      process.env.REFRESH_TOKEN_SALT,
    ) as TokenPayload;

    return id;
  }
}
