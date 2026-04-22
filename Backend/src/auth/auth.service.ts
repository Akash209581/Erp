import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    console.log(`Validating user: ${username}`);
    try {
      const user = await this.usersService.findOne(username);
      if (!user) {
        console.log('User not found in DB');
        return null;
      }
      const isMatch = await bcrypt.compare(pass, user.password);
      if (user && isMatch) {
        const { password, ...result } = user;
        return result;
      }
      console.log('Password mismatch');
      return null;
    } catch (err) {
      console.error('Error during validateUser:', err);
      throw err;
    }
  }

  async login(user: any) {
    const payload = { username: user.username, sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
          id: user.id,
          username: user.username,
          role: user.role
      }
    };
  }
}
