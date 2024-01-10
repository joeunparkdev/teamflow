import { TypeOrmModule } from "@nestjs/typeorm";
import { seeder } from "nestjs-seeder";
import { Columns } from "./columns/entities/columns.entity";
import { UserSeed } from "./seed/user.seed";
import { User } from './user/entities/user.entity';
seeder({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT, 10) || 3306,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      autoLoadEntities: true,
      synchronize: process.env.DB_SYNC === 'true',
    }),
    
    TypeOrmModule.forFeature([User]),
  ]
}).run([UserSeed]);
