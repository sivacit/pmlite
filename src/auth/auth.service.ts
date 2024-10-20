// src/auth/auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service'; // Correctly import UsersService

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {} // Inject UsersService

  async signIn(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne(username); // Call method on UsersService
    if (user?.password !== pass) {
      throw new UnauthorizedException();
    }
    const { password, ...result } = user;
    return result;
  }
}
