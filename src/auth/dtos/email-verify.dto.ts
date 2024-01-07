import { PickType } from '@nestjs/swagger';
import { User } from 'src/user/entities/user.entity';

export class EmailVerifyDto extends PickType(User, ['email']) {}
