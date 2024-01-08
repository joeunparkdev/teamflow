import { SignUpDto } from './dtos/sign-up.dto';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { SignInDto } from './dtos/sign-in.dto';
import { JwtService } from '@nestjs/jwt';
export declare class AuthService {
    private readonly configService;
    private readonly jwtService;
    private readonly userRepository;
    constructor(configService: ConfigService, jwtService: JwtService, userRepository: Repository<User>);
    signUp({ email, password, passwordConfirm, name }: SignUpDto): Promise<{
        accessToken: string;
    }>;
    signIn(userId: number): {
        accessToken: string;
    };
    validateUser({ email, password }: SignInDto): Promise<{
        id: number;
    }>;
}
