import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { AuthModule } from 'src/auth/auth.module';
import { Cards} from '../cards/entities/cards.entity';
import { Comments } from '../comments/entities/comments.entity';
@Module({
  imports: [TypeOrmModule.forFeature([User, Cards, Comments]), AuthModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
