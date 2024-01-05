import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt } from "passport-jwt";
import { Strategy } from "passport-local";
import { UserService } from "src/user/user.service";

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
    Strategy,
    'jwt-refresh-token',
) {
    constructor(
        private readonly configService: ConfigService,
        private readonly userService: UserService,
    ){
        super({
            jwtFromRequest : ExtractJwt.fromExtractors([
                (request)=> {
                    return request?.cookies?.Refresh;
                },
            ]),
            secretOrKey: configService.get('JWT_REFRESH_TOKEN_SECRET'),
            passReqToCallback: true,
        })
    }
    
    async validate(req, payload: any) {
        const refreshToken = req.cookies?.Refresh;
        return this.userService.getUserIfRefreshTokenMatches(
          refreshToken,
          payload.id,
        );
      }
}
