import { Injectable, UnauthorizedException, Dependencies } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
@Dependencies(JwtService)
export class JwtAuthGuard {
  constructor(jwtService) {
    this.jwtService = jwtService;
  }

  async canActivate(context) {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      const payload = await this.jwtService.verifyAsync(
        token,
        {
          secret: process.env.JWT_SECRET
        }
      );
      // We're assigning the payload to the request object here
      request['user'] = payload;
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }

  extractTokenFromHeader(request) {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
