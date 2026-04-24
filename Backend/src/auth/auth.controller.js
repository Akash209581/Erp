import { Controller, Post, Body, UnauthorizedException, Dependencies } from '@nestjs/common';
import { AuthService } from './auth.service.js';

@Controller('auth')
@Dependencies(AuthService)
export class AuthController {
  constructor(authService) {
    this.authService = authService;
  }

  @Post('login')
  async login(@Body() loginDto) {
    const user = await this.authService.validateUser(loginDto.username, loginDto.password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return this.authService.login(user);
  }
}
