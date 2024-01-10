import _ from 'lodash';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOneOptions, QueryFailedError } from 'typeorm';
import { Columns } from './entities/columns.entity';
import { ColumnsDto } from './dtos/columns.dto';
import { User } from '../user/entities/user.entity';
import { Cards } from '../cards/entities/cards.entity';
import { ColumnsMoveDto } from './dtos/columns-move.dto';
import { LexoRank } from 'lexorank';
import { UserService } from '../user/user.service';
//import { col } from 'sequelize';

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
      select: ['id', 'name', 'position'],
      order: { position: 'ASC' },
      relations: { cards: {comments:true} },
    });

    return many_column;
  }

  async getColumn(boardId: number, columnId: number): Promise<Columns> {
    const one_column = await this.verifyColumnById(columnId, {
      where: { boardId },
      select: ['id', 'name', 'position'],
      order: { position: 'ASC' },
      relations: { cards: {comments:true} },
    });
    return one_column;
  }

  async getLastColumn(boardId: number): Promise<Columns> {
    const lastColumn = await this.columnsRepository.findOne({
      where: { boardId },
      select: ['id', 'name', 'position'],
      order: { position: 'DESC' },
      relations: { cards: true },
    });

    return lastColumn;
  }

  async createColumn(
    boardId: number,
    columnsDto: ColumnsDto,
    userId: number,
  ): Promise<Columns> {
    const one_user = await this.userRepository.findOneBy({ id: userId });
    if (_.isNil(one_user)) {
      throw new NotFoundException('할당 하려는 사용자는 존재하지 않습니다.');
    }

    const existingColumn = await this.columnsRepository.findOne({
      where: { boardId, name: columnsDto.name },
    });

    if (existingColumn) {
      console.error('Error in createColumn:');
      throw new BadRequestException('같은 이름의 컬럼이 존재합니다.');
    }

    //1. 아무 컬럼이 없을때는 LexoRank.middle로 값생성
    const lastColumn = await this.getLastColumn(boardId);
    if (!lastColumn) {
      const noColumns = LexoRank.middle().toString();
      const created_column = await this.columnsRepository.save({
        ...columnsDto,
        position: noColumns,
        createdUserId: userId,
        boardId,
      });

      return created_column;
    }

    //2. 컬럼이 있을때는 마지막 컬럼 기준으로 genNext()로 값 할당
    const withColumns = lastColumn.position;
    const withLexo = LexoRank.parse(withColumns);
    const withLexoNext = withLexo.genNext().toString();

    const created_column = await this.columnsRepository.save({
      ...columnsDto,
      position: withLexoNext,
      createdUserId: userId,
      boardId,
    });

    return created_column;
  }

  async updateColumn(
    boardId: number,
    columnId: number,
    columnsDto: ColumnsDto,
    userId: number,
  ): Promise<Columns> {
    try {
      const one_user = await this.userRepository.findOneBy({ id: userId });
      if (_.isNil(one_user)) {
        throw new NotFoundException('할당 하려는 사용자는 존재하지 않습니다.');
      }

      const one_column = await this.verifyColumnById(columnId, {
        where: { boardId },
      });
      await this.checkColumn(one_column.createdUserId, userId);

      const updated_column = await this.columnsRepository.save({
        id: columnId,
        ...columnsDto,
        boardId,
      });

      return updated_column;
    } catch (error) {
      console.error('Error in createColumn:', error);
      throw new BadRequestException('컬럼 수정 중 오류가 발생했습니다.');
    }
  }

  async deleteColumn(
    boardId: number,
    columnId: number,
    userId: number,
  ): Promise<void> {
    const one_user = await this.userRepository.findOneBy({ id: userId });
    if (_.isNil(one_user)) {
      throw new NotFoundException('할당 하려는 사용자는 존재하지 않습니다.');
    }
    const one_column = await this.verifyColumnById(columnId, {
      where: { boardId },
    });
    await this.checkColumn(one_column.createdUserId, userId);
    await this.columnsRepository.delete({ id: columnId });
  }

  private async verifyColumnById(
    columnId: number,
    options?: FindOneOptions<Columns>,
  ): Promise<Columns> {
    const one_column = await this.columnsRepository.findOne({
      where: { id: columnId },
    });
    if (!one_column) {
      throw new NotFoundException('존재하지 않는 컬럼 입니다.');
    }
    return one_column;
  }

  private async checkColumn(
    createUserId: number,
    userId: number,
  ): Promise<void> {
    if (createUserId !== userId) {
      throw new BadRequestException('해당 컬럼을 수정할 수 없습니다.');
    }
  }

  async lexoMoveColumn(
    boardId: number,
    columnId: number,
    columnsMoveDto: ColumnsMoveDto,
    userId: number,
  ) {
    const one_user = await this.userRepository.findOneBy({ id: userId });
    if (_.isNil(one_user)) {
      throw new NotFoundException('할당 하려는 사용자는 존재하지 않습니다.');
    }
    
    const columnToMove = await this.verifyColumnById(columnId, {
      where: { boardId },
    });

    const prev = columnsMoveDto.prev; //column id
    const next = columnsMoveDto.next; //column id
    // prev값만 받을때 (맨 앞으로 움직일때)
    if (!next) {
      const prevColumnToMove = await this.verifyColumnById(prev, {
        where: { boardId },
      });
      const prevColumnPosition = LexoRank.parse(prevColumnToMove.position);
      const betweenColumnPosition = prevColumnPosition.genNext(); //destination
      return await this.columnsRepository.save({
        id: columnId,
        position: betweenColumnPosition.toString(),
      });
    }
    // next값만 받을때 (맨 뒤로 움직일때)
    if (!prev) {
      const nextColumnToMove = await this.verifyColumnById(next, {
        where: { boardId },
      });
      const nextColumnPosition = LexoRank.parse(nextColumnToMove.position);
      const betweenColumnPosition = nextColumnPosition.genPrev(); //destination
      return await this.columnsRepository.save({
        id: columnId,
        position: betweenColumnPosition.toString(),
      });
    }

    // prev과 next값을 받을때
    const prevColumnToMove = await this.verifyColumnById(prev, {
      where: { boardId },
    });
    const nextColumnToMove = await this.verifyColumnById(next, {
      where: { boardId },
    });
    const prevColumnPosition = LexoRank.parse(prevColumnToMove.position);
    const nextColumnPosition = LexoRank.parse(nextColumnToMove.position);
    const betweenColumnPosition =
      nextColumnPosition.between(prevColumnPosition); //destination
    return await this.columnsRepository.save({
      id: columnId,
      position: betweenColumnPosition.toString(),
    });
  }
}
