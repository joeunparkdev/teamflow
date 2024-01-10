import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { AuthModule } from '../auth/auth.module';
import { Cards } from '../cards/entities/cards.entity';
import { Comments } from '../comments/entities/comments.entity';
import { Columns } from '../columns/entities/columns.entity';
import { BoardUser } from '../board-user/entities/board-user.entity';
@Module({
  imports: [
    TypeOrmModule.forFeature([User, Cards, Comments, Columns,BoardUser]),
    AuthModule,
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
