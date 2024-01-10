import { Module } from '@nestjs/common';
import { BoardUserService } from './board-user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BoardUser } from './entities/board-user.entity';

import { EmailModule } from '../email/email.module';
import { User } from '../user/entities/user.entity';
import { AuthModule } from '../auth/auth.module';
import { Invitation } from '../board/entities/invitation.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([BoardUser, Invitation, BoardUser, User]),
    EmailModule,
    AuthModule,
  ],
  providers: [BoardUserService],
  exports: [BoardUserService],
})
export class BoardUserModule {}
