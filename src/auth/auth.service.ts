import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { TokenPayload } from './model/TokenPayload';
import { OAuth2Client } from 'google-auth-library';
import { SOCIAL_TYPE_ID } from '../util/constans';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
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

  login(user: User): string {
    const payload: TokenPayload = { id: user.id };
    return this.jwtService.sign(payload);
  }

  testerLogin(tester_id): string {
    return this.jwtService.sign({ id: tester_id });
  }
}
