import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CardsController } from './cards.controller';
import { CardsService } from './cards.service';
import { Cards } from './entities/cards.entity';
import { User } from 'src/user/entities/user.entity';
import { Comments } from './entities/comments.entity';
import { UserModule } from '../user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([Cards, Comments, User]), UserModule],
  controllers: [CardsController],
  providers: [CardsService],
})
export class CardsModule {}
