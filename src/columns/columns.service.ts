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
import { User } from 'src/user/entities/user.entity';
import { Cards } from 'src/cards/entities/cards.entity';
import { ColumnsMoveDto } from './dtos/columns-move.dto';
import { LexoRank } from 'lexorank';

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
      relations: { cards: true },
    });

    if (!many_column.length) {
      throw new NotFoundException('컬럼이 없습니다.');
    }

    return many_column;
  }

  async getColumn(boardId: number, columnId: number): Promise<Columns> {
    const one_column = await this.verifyColumnById(columnId, {
      where: { boardId },
      select: ['id', 'name', 'position'],
      order: { position: 'ASC' },
      relations: { cards: true },
    });
    return one_column;
  }

  async createColumn(
    boardId: number,
    columnsDto: ColumnsDto,
    userId: number,
  ): Promise<Columns> {
    const existingColumn = await this.columnsRepository.findOne({
      where: { boardId, name: columnsDto.name },
    });

    if (existingColumn) {
      console.error('Error in createColumn:');
      throw new BadRequestException('같은 이름의 컬럼이 존재합니다.');
    }
    
    //1. 아무 컬럼이 없을때는 LexoRank.middle로 값생성
    //2. 컬럼이 있을때는 마지막 컬럼 기준으로 genNext()로 값 할당
    const columns_num = await this.columnsRepository.count({
      where: { boardId },
    });

    const created_column = await this.columnsRepository.save({
      ...columnsDto,
      order: columns_num,
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
    const columnToMove = await this.verifyColumnById(columnId, {
      where: { boardId },
    });

    const prev = columnsMoveDto.prev; //column id
    const next = columnsMoveDto.next; //column id

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
    return await this.columnsRepository.update(
      { id: columnId },
      { position: betweenColumnPosition.toString() },
    );
  }



  // async moveColumn(
  //   boardId: number,
  //   columnId: number,
  //   columnsMoveDto: ColumnsMoveDto,
  //   userId: number,
  // ) {
  //   const columnToMove = await this.verifyColumnById(columnId, {
  //     where: { boardId },
  //   });
  //   const originalOrder = columnToMove.order;
  //   const newOrder = columnsMoveDto.order;
  //   //이동 거리 계산
  //   const distance = Math.abs(originalOrder - newOrder);
  //   await this.updateOtherColumnsOrder(
  //     boardId,
  //     columnToMove,
  //     originalOrder,
  //     newOrder,
  //     distance,
  //   );

  //   columnToMove.order = newOrder;
  //   const movedColumn = await this.columnsRepository.save(columnToMove);

  //   if (distance >= 1) {
  //     const allColumns = await this.getAllColumns(boardId);
  //     const otherColumn = allColumns.find((col) => col.id !== movedColumn.id);
  //     const tempOrder = otherColumn.order;
  //     otherColumn.order = movedColumn.order;
  //     movedColumn.order = tempOrder;

  //     await Promise.all([
  //       this.columnsRepository.save(otherColumn),
  //       this.columnsRepository.save(movedColumn),
  //     ]);
  //   }
  //   return movedColumn;
  // }

  // async updateOtherColumnsOrder(
  //   boardId: number,
  //   movedColumn: Columns,
  //   originalOrder: number,
  //   newOrder: number,
  //   distance: number,
  // ) {
  //   const allColumns = await this.getAllColumns(boardId);
  //   const numColumns = allColumns.length;

  //   if (numColumns <= 2) {
  //     const otherColumn = allColumns.find(
  //       (column) => column.id !== movedColumn.id,
  //     );
  //     const tempOrder = otherColumn.order;
  //     otherColumn.order = movedColumn.order;
  //     movedColumn.order = tempOrder;

  //     await Promise.all([
  //       this.columnsRepository.save(otherColumn),
  //       this.columnsRepository.save(movedColumn),
  //     ]);
  //   } else {
  //     for (const column of allColumns) {
  //       if (column.id !== movedColumn.id) {
  //         if (originalOrder < newOrder) {
  //           // 오른쪽으로 이동
  //           if (column.order > originalOrder && column.order <= newOrder) {
  //             column.order -= distance;
  //             await this.columnsRepository.save(column);
  //           }
  //         } else if (originalOrder > newOrder) {
  //           // 왼쪽으로 이동
  //           if (column.order < originalOrder && column.order >= newOrder) {
  //             column.order += distance;
  //             await this.columnsRepository.save(column);
  //           }
  //         }
  //       }
  //     }
  //   }
  // }
}
