import { DataFactory, Seeder } from 'nestjs-seeder';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Board } from '../board/entities/board.entity';

@Injectable()
export class BoardSeed implements Seeder {
  constructor(
    @InjectRepository(Board)
    private boardRepository: Repository<Board>,
  ) {}

  seed(): Promise<any> {
    const board = DataFactory.createForClass(Board).generate(50);

    return this.boardRepository.insert(board);
  }
  drop(): Promise<any> {
    return this.boardRepository.delete({});
  }
}
