import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() body: any) {
    const identifier = body.email || body.phone;
    if (!identifier || !body.password) {
      throw new UnauthorizedException('Email/Phone and password required');
    }
    const user = await this.authService.validateUser(identifier, body.password);
    return this.authService.login(user);
  }
}
