import { UserRole } from '../types/user-role.type';
export declare class User {
    id: number;
    email: string;
    password: string;
    nickname: string;
    points: number;
    role: UserRole;
    createdAt: Date;
    updatedAt: Date;
}
