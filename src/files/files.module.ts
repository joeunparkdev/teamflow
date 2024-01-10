import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { FilesController } from './files.controller';
import { FilesService } from './files.service';
import { Files } from './entities/file.entity';
import { CardsModule } from '../cards/cards.module';

@Module({
  imports: [TypeOrmModule.forFeature([Files]), CardsModule],
  controllers: [FilesController],
  providers: [FilesService],
})
export class FilesModule {}
