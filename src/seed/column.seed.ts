import { DataFactory, Seeder } from 'nestjs-seeder';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Columns } from '../columns/entities/columns.entity';

@Injectable()
export class ColumnSeed implements Seeder {
  constructor(
    @InjectRepository(Columns)
    private columnsRepository: Repository<Columns>,
  ) {}

  seed(): Promise<any> {
    const columns = DataFactory.createForClass(Columns).generate(10);
    console.log(columns);

    return this.columnsRepository.insert(columns);
  }
  drop(): Promise<any> {
    return this.columnsRepository.delete({});
  }
}
