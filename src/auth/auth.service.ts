import { ForbiddenException, Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { LoginUserDto } from '../user/dto/login-user-dto';
import { UserEntity } from '../user/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '../user/dto/create-user.dto';

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

  generateJwtToken(data: { id: number; email: string }) {
    const payload = { id: data.id, email: data.email };
    return this.jwtService.sign(payload);
  }

  async login(user: UserEntity) {
    try {
      const { password, ...userDate } = user;
      return {
        ...userDate,
        access_token: this.generateJwtToken(userDate),
      };
    } catch (err) {
      throw new ForbiddenException('Ошибка при авторизации');
    }
  }

  async register(dto: CreateUserDto) {
    try {
      const { password, ...user } = await this.usersService.create(dto);
      return {
        ...user,
        access_token: this.generateJwtToken(user),
      };
    } catch (err) {
      throw new ForbiddenException(err.message);
    }
  }
}
