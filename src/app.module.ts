import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { configModuleValidationSchema } from './configs/env-validation.config';
import { typeOrmModuleOptions } from './configs/database.config';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';

import { BoardModule } from './board/board.module';

import { CardsModule } from './cards/cards.module';
import { ColumnsController } from './columns/columns.controller';

import { CommentsModule } from './comments/comments.module';
import { ColumnsModule } from './columns/columns.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: configModuleValidationSchema,
    }),
    TypeOrmModule.forRootAsync(typeOrmModuleOptions),
    AuthModule,
    UserModule,
    CardsModule,
    ColumnsModule,
    BoardModule,

  ],
})
export class AppModule {}
