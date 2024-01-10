import { DataFactory, Seeder } from 'nestjs-seeder';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BoardUser } from '../board-user/entities/board-user.entity';

@Injectable()
export class BoardUserSeed implements Seeder {
  constructor(
    @InjectRepository(BoardUser)
    private boardUserRepository: Repository<BoardUser>,
  ) {}

  seed(): Promise<any> {
    const boardUser = DataFactory.createForClass(BoardUser).generate(10);

    return this.boardUserRepository.insert(boardUser);
  }
  drop(): Promise<any> {
    return this.boardUserRepository.delete({});
  }
}
