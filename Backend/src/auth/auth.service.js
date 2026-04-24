import { Injectable, Dependencies } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service.js';
import bcrypt from 'bcrypt';

@Injectable()
@Dependencies(UsersService, JwtService)
export class AuthService {
  constructor(usersService, jwtService) {
    this.usersService = usersService;
    this.jwtService = jwtService;
  }

  async validateUser(username, pass) {
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

  async login(user) {
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
