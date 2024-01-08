import { User } from 'src/user/entities/user.entity';
declare const SignUpDto_base: import("@nestjs/common").Type<Pick<User, "name" | "password" | "email">>;
export declare class SignUpDto extends SignUpDto_base {
    passwordConfirm: string;
}
export {};
