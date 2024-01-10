import { Module } from '@nestjs/common';
import { BoardController } from './board.controller';
import { BoardService } from './board.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Board } from './entities/board.entity';
import { VerificationCode } from './entities/verificationCode.entity';
import { EmailVerification } from '../email/entities/email.entity';
import { AuthController } from '../auth/auth.controller';
import { EmailModule } from '../email/email.module';
import { BoardUser } from '../board-user/entities/board-user.entity';
import { User } from '../user/entities/user.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Board, VerificationCode, BoardUser, User]),
    EmailModule,
    AuthModule,
  ],
  controllers: [BoardController],
  providers: [BoardService],
  exports: [BoardService],
})
export class BoardModule {}
