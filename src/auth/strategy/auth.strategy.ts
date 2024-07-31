import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';

import { Request } from 'express';
import { AuthService } from '../auth.service';
import { ENVIRONMENT } from 'src/common/constants/environment/env.variable';
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      passReqToCallback: true,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: ENVIRONMENT.JWT.SECRET,
    });
  }

  async validate(req: Request, payload: Partial<{ _id: string }>) {
    const { _id } = payload;

    //const token = req.headers.authorization.replace('Bearer', ''); // TODO: use later

    const user = await this.authService.getByJwtToken(_id);

    if (!user) {
      throw new UnauthorizedException(`Token expired or does not exist.`);
    }

    return user;
  }
}
