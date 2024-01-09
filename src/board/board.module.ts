import { Module } from '@nestjs/common';
import { BoardController } from './board.controller';
import { BoardService } from './board.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Board } from './entities/board.entity';
import { VerificationCode } from './entities/verificationCode.entity';
import { EmailVerification } from 'src/email/entities/email.entity';
import { AuthController } from 'src/auth/auth.controller';
import { EmailModule } from 'src/email/email.module';
import { BoardUser } from '../board-user/board-user.entity.ts/boardUser.entity';
import { User } from 'src/user/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Board, VerificationCode, BoardUser, User]),
    EmailModule,
  ],
  controllers: [BoardController],
  providers: [BoardService],
  exports: [BoardService],
})
export class BoardModule {}
