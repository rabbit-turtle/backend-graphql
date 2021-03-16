import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { PrismaService } from 'src/prisma.service';
import { RedisModule } from 'src/redis/redis.module';
import { UsersModule } from 'src/users/users.module';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategy/jwt.strategy';
// import { AuthController } from './auth.controller';
// import { GoogleStrategy } from './strategy/google.strategy';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.ACCESS_TOKEN_SALT,
      signOptions: { expiresIn: `${process.env.ACCESS_TOKEN_EXPIRES_IN}s` },
    }),
    PassportModule,
    RedisModule,
    UsersModule,
  ],
  // controllers: [AuthController],
  providers: [
    PrismaService,
    AuthService,
    JwtStrategy,
    AuthResolver,
    // GoogleStrategy,
  ],
  exports: [AuthService],
})
export class AuthModule {}
