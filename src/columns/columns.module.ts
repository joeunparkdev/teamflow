import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
<<<<<<< HEAD
import { ColumnsController } from './Columns.controller';
import { ColumnsService } from './columns.service';
import { Columns } from './entities/Columns.entity';
import { User } from '../user/entities/user.entity';
=======
import { ColumnsController } from './columns.controller';
import { ColumnsService } from './columns.service';
import { Columns } from './entities/columns.entity';
import { User } from 'src/user/entities/user.entity';
>>>>>>> 8d6355cdd369281453a2b89e24b7115c538135f0
import { UserModule } from '../user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([Columns, User]), UserModule],
  controllers: [ColumnsController],
  providers: [ColumnsService],
})
export class ColumnsModule {}
