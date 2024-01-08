import _ from 'lodash';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOneOptions } from 'typeorm';
import { Columns } from './entities/columns.entity';
import { ColumnsDto } from './dtos/columns.dto';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class ColumnsService {
  constructor(
    @InjectRepository(Columns)
    private columnsRepository: Repository<Columns>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async getAllColumns(boardId: number): Promise<Columns[]> {
    const many_column = await this.columnsRepository.find({
      where: { boardId },
      select: ['id', 'name', 'orderNum'],
      order: { orderNum: 'ASC' },
    });

    if (!many_column.length) {
      throw new NotFoundException('컬럼이 없습니다.');
    }

    return many_column;
  }

  async getColumn(boardId: number, columnId: number): Promise<Columns> {
    const one_column = await this.verifyColumnById(columnId, { where: { boardId } });
    return one_column;
  }

  async createColumn(boardId: number, columnsDto: ColumnsDto, userId: number): Promise<Columns> {
    const columns_num = (await this.columnsRepository.count({ where: { boardId } })) + 1;
    const created_column = await this.columnsRepository.save({
      ...columnsDto,
      orderNum: columns_num,
      createdUserId: userId,
      boardId,
    });

    return created_column;
  }

  async updateColumn(boardId: number, columnId: number, columnsDto: ColumnsDto, userId: number): Promise<Columns> {
    const one_column = await this.verifyColumnById(columnId, { where: { boardId } });
    await this.checkColumn(one_column.createdUserId, userId);

    const updated_column = await this.columnsRepository.save({
      id: columnId,
      ...columnsDto,
      boardId,
    });

    return updated_column;
  }

  async deleteColumn(boardId: number, columnId: number, userId: number): Promise<void> {
    const one_column = await this.verifyColumnById(columnId, { where: { boardId } });
    await this.checkColumn(one_column.createdUserId, userId);
    await this.columnsRepository.delete({ id: columnId });
  }

  private async verifyColumnById(columnId: number, options?: FindOneOptions<Columns>): Promise<Columns> {
    const one_column = await this.columnsRepository.findOne(
        {where: {id:columnId}});
    if (!one_column) {
      throw new NotFoundException('존재하지 않는 컬럼 입니다.');
    }
    return one_column;
  }

  private async checkColumn(createUserId: number, userId: number): Promise<void> {
    if (createUserId !== userId) {
      throw new BadRequestException('해당 컬럼을 수정할 수 없습니다.');
    }
  }
}
