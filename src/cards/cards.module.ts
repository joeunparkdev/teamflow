import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CardsController } from './cards.controller';
import { CardsService } from './cards.service';
import { Cards } from './entities/cards.entity';
import { User } from '../user/entities/user.entity';
import { Comments } from '../comments/entities/comments.entity';
import { UserModule } from '../user/user.module';
import { Columns } from '../columns/entities/columns.entity';
import { SlackModule } from 'nestjs-slack';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([Cards, Comments, User, Columns]),
    SlackModule.forRootAsync({
      useFactory: (configService: ConfigService) => {
        return {
          type: 'webhook',
          url: configService.get<string>('WEB_HOOK_URL'),
        };
      },
      inject: [ConfigService],
    }),
    UserModule,
  ],
  controllers: [CardsController],
  providers: [CardsService],
})
export class CardsModule {}
