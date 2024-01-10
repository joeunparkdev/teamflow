import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { seeder } from 'nestjs-seeder';
import { Column } from 'typeorm';
import { BoardUser } from './board-user/entities/board-user.entity';
import { Board } from './board/entities/board.entity';
import { Cards } from './cards/entities/cards.entity';
import { Columns } from './columns/entities/columns.entity';
import { Comments } from './comments/entities/comments.entity';
import { configModuleValidationSchema } from './configs/env-validation.config';
import { BoardUserSeed } from './seed/board-user.seed';
import { BoardSeed } from './seed/board.seed';
import { CardSeed } from './seed/card.seed';
import { ColumnSeed } from './seed/column.seed';
import { CommentsSeed } from './seed/comment.seed';
import { UserSeed } from './seed/user.seed';
import { User } from './user/entities/user.entity';
seeder({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: configModuleValidationSchema,
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT, 10) || 3306,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      //  autoLoadEntities: true,
      entities: [User, Cards, Comments, Columns, Board],
      synchronize: process.env.DB_SYNC === 'true',
    }),

    TypeOrmModule.forFeature([User,Board, BoardUser, Columns, Cards, Comments]),
  ],
}).run([UserSeed,BoardSeed,ColumnSeed,CardSeed,CommentsSeed]);
