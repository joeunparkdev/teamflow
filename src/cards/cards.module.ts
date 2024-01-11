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
import { Files } from '../files/entities/file.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Cards, Comments, User, Columns, Files]),
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
  exports: [CardsService],
})
export class CardsModule {}
