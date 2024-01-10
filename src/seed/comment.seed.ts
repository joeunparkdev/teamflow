import { DataFactory, Seeder } from 'nestjs-seeder';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comments } from '../comments/entities/comments.entity';

@Injectable()
export class CommentsSeed implements Seeder {
  constructor(
    @InjectRepository(Comments)
    private commentsRepository: Repository<Comments>,
  ) {}

  seed(): Promise<any> {
    const comments = DataFactory.createForClass(Comments).generate(10);

    return this.commentsRepository.insert(comments);
  }
  drop(): Promise<any> {
    return this.commentsRepository.delete({});
  }
}
