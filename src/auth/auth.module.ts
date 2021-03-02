import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { PrismaService } from 'src/prisma.service';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategy/jwt.strategy';
// import { AuthController } from './auth.controller';
// import { GoogleStrategy } from './strategy/google.strategy';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.TOKEN_SALT,
    }),
    PassportModule,
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
