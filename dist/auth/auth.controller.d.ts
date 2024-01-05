import { HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dtos/sign-up.dto';
import { SignInDto } from './dtos/sign-in.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    signUp(signUpDto: SignUpDto): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: {
            accessToken: string;
        };
    }>;
    signIn(req: any, signInDto: SignInDto): {
        statusCode: HttpStatus;
        message: string;
        data: {
            accessToken: string;
        };
    };
    signOut(req: any): {
        statusCode: HttpStatus;
        message: string;
        data: void;
    };
}
