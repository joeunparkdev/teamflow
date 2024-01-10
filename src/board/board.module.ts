import { Module } from '@nestjs/common';
import { BoardController } from './board.controller';
import { BoardService } from './board.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Board } from './entities/board.entity';
import { Invitation } from './entities/invitation.entity';
import { EmailVerification } from 'src/email/entities/email.entity';
import { AuthController } from 'src/auth/auth.controller';
import { EmailModule } from 'src/email/email.module';
import { BoardUser } from '../board-user/entities/boardUser.entity';
import { User } from 'src/user/entities/user.entity';
import { AuthModule } from 'src/auth/auth.module';

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
