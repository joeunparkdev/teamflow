import { Module } from '@nestjs/common';
import { BoardController } from './board.controller';
import { BoardService } from './board.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Board } from './entities/board.entity';

import { EmailModule } from '../email/email.module';
import { BoardUser } from '../board-user/entities/board-user.entity';
import { User } from '../user/entities/user.entity';
import { AuthModule } from '../auth/auth.module';
import { Invitation } from './entities/invitation.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Board, Invitation, BoardUser, User]),
    EmailModule,
    AuthModule,
  ],
  controllers: [BoardController],
  providers: [BoardService],
  exports: [BoardService],
})
export class BoardModule {}
