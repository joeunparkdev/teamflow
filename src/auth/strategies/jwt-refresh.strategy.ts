import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth.service';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh-token',
) {
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  async validate(payload: any) {
    console.log('JwtRefreshStrategy validate:', payload);
    try {
      const refreshToken = payload?.refreshToken || payload?.rfsToken;
      console.log(refreshToken);
      if (!refreshToken) {
        console.error('Refresh token is missing in payload:', payload);
        throw new UnauthorizedException('토큰이 유효하지 않습니다.');
      }

      const user = await this.authService.validateRefreshToken(
        payload.sub,
        refreshToken,
      );
      if (!user) {
        console.error('Refresh token validation failed:', payload);
        throw new UnauthorizedException();
      }

      return user;
    } catch (error) {
      console.error('Error in validate:', error);
      throw new UnauthorizedException();
    }
  }
}
