import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { LoginUserDto } from '../user/dto/login-user-dto';
import { UserEntity } from '../user/entities/user.entity';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const objLogin: LoginUserDto = {
      email,
      password,
    };
    const user = await this.usersService.findByCond(objLogin);
    if (user && user.password === password) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: UserEntity) {
    const { password, ...userDate } = user;
    const payload = { email: user.email, sub: user.id };
    return {
      ...userDate,
      access_token: this.jwtService.sign(payload),
    };
  }
}
