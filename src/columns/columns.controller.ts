import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Request,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { LexoRank } from 'lexorank';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ColumnsService } from './columns.service';
import { ColumnsMoveDto } from './dtos/columns-move.dto';
import { ColumnsDto } from './dtos/columns.dto';

@ApiTags('컬럼')
@Controller('/boards/:boardId/columns')
export class ColumnsController {
  constructor(private readonly columnsService: ColumnsService) {}

  /**
   * 모든 컬럼 보기
   * @returns
   */
  @Get()
  async getAllColumns(@Param('boardId') boardId: number) {
    const data = await this.columnsService.getAllColumns(boardId);
    return {
      statusCode: HttpStatus.OK,
      message: '모든 컬럼 불러오기에 성공했습니다.',
      data,
    };
  }

  /**
   * 컬럼 상세 보기
   * @returns
   */
  @Get(':columnId')
  async getColumn(
    @Param('boardId') boardId: number,
    @Param('columnId') columnId: number,
  ) {
    const column = await this.columnsService.getColumn(boardId, columnId);
    return {
      statusCode: HttpStatus.OK,
      message: '컬럼 상세 보기에 성공했습니다.',
      column,
    };
  }

  /**
   * 컬럼 만들기
   * @param columnsDto
   * @returns
   */
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post()
  async createColumn(
    @Param('boardId') boardId: number,
    @Body() columnsDto: ColumnsDto,
    @Request() req,
  ) {
    const user_id = req.user.id;
    const created_column = await this.columnsService.createColumn(
      boardId,
      columnsDto,
      user_id,
    );
    return {
      statusCode: HttpStatus.OK,
      message: '컬럼 생성에 성공했습니다.',
      created_column,
    };
  }

  /**
   * 컬럼 수정
   * @param columnsDto
   * @returns
   */
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Put(':columnId')
  async updateColumn(
    @Param('boardId') boardId: number,
    @Param('columnId') columnId: number,
    @Body() columnsDto: ColumnsDto,
    @Request() req,
  ) {
    const user_id = req.user.id;
    const updated_column = await this.columnsService.updateColumn(
      boardId,
      columnId,
      columnsDto,
      user_id,
    );
    return updated_column;
  }

  /**
   * 컬럼 이동
   * @param columnsMoveDto
   * @returns
   */
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Put(':columnId/order')
  async moveColumn(
    @Param('boardId') boardId: number,
    @Param('columnId') columnId: number,
    @Body() columnsMoveDto: ColumnsMoveDto,
    @Request() req,
  ) {
    const user_id = req.user.id;
    const moved_column = await this.columnsService.lexoMoveColumn(
      boardId,
      columnId,
      columnsMoveDto,
      user_id,
    );
    return moved_column;
  }

  /**
   * 컬럼 삭제
   * @param columnsDto
   * @returns
   */
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete(':columnId')
  async deleteColumn(
    @Param('boardId') boardId: number,
    @Param('columnId') columnId: number,
    @Request() req,
  ) {
    const user_id = req.user.id;
    return await this.columnsService.deleteColumn(boardId, columnId, user_id);
  }
}
