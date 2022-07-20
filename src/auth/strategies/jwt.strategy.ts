import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { UserService } from '../../user/user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'test',
    });
  }

  async validate(payload: { sub: number; email: string }) {
    const { sub } = payload;
    const user = await this.userService.findById(sub);
    const { password, ...userData } = user;

    if (!user) {
      throw new UnauthorizedException('Нет доступа к этой странице');
    }
    return {
      ...userData,
    };
  }
}
