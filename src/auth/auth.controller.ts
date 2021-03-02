import { Get, UseGuards, Req, Controller } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('google')
  @UseGuards(AuthGuard('google'))
  googleLogin() {
    return;
  }

  @Get('google/redirect')
  @UseGuards(AuthGuard('google'))
  async googleLoginCallback(@Req() req) {
    console.log(req.user);

    return {
      message: 'login success!',
      email: req.user.email,
    };
  }
}
