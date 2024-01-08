import { Module } from '@nestjs/common';
import { BoardController } from './board.controller';
import { BoardService } from './board.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Board } from './entities/board.entity';
import { VerificationCode } from './entities/verificationCode.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Board,VerificationCode])],
  controllers: [BoardController],
  providers: [BoardService],
  exports: [BoardService],
})
export class BoardModule {}
