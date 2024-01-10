import { DataFactory, Seeder } from 'nestjs-seeder';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cards } from '../cards/entities/cards.entity';

@Injectable()
export class CardSeed implements Seeder {
  constructor(
    @InjectRepository(Cards)
    private cardRepository: Repository<Cards>,
  ) {}

  seed(): Promise<any> {
    const card = DataFactory.createForClass(Cards).generate(10);

    return this.cardRepository.insert(card);
  }
  drop(): Promise<any> {
    return this.cardRepository.delete({});
  }
}
