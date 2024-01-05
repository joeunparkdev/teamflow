import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Put,
  Post,
} from '@nestjs/common';
import { BoardService } from './board.service';
import { BoardDto } from './dto/board.dto';
import { UpdateBoardDto } from './dto/updateBoard.dto';
import { InvitataionDto } from './dto/invitation.dto';

@Controller('board')
export class BoardController {
  constructor(private readonly boardService: BoardService) {}

  // 허용된 사용자만 게시할 수 있는 데코레이터 추가
  @Post()
  async postBoard(@Body() boardDto: BoardDto) {
    const postedBoard = await this.boardService.postBoard(boardDto);

    return {
      status: 201,
      message: '보드가 정상적으로 생성되었습니다.',
      data: postedBoard,
    };
  }
  // 허용된 사용자만 수정할 수 있는 데코레이터 추가
  @Put(':boardId')
  async updateBoard(
    @Param('boardId') boardId: number,
    @Body() updateBoardDto: UpdateBoardDto,
  ) {
    const updatedBoard = await this.boardService.updateBoard(
      boardId,
      updateBoardDto,
    );

    return {
      satus: 201,
      //`${updatedBoard.name}보드가 정상적으로 변경되었습니다.`
      message: '보드가 정상적으로 변경되었습니다.',
      data: updatedBoard,
    };
  }

  // 허용된 사용자만 삭제할 수 있는 데코레이터 추가
  @Delete(':boardId')
  async deleteBoard(@Param('boardId') boardId: number) {
    const deletedBoard = await this.boardService.deleteBoard(boardId);

    return {
      statusCode: 200,
      // `${deletedBoard.name} 보드가 정상적으로 삭제되었습니다.`
      message: '보드가 정상적으로 삭제되었습니다.',
      data: deletedBoard,
    };
  }

  // work space 안 만들었기 때문에 하나씩만 조회 가능하도록 만듦.
  // 초대받은 사용자만 이용할 수 있도록 만들기
  @Get(':boardId')
  async getBoard(@Param('boardId') boardId: number) {
    const board = await this.boardService.findBoardById(boardId);
  }

  @Post()
  async inviteMember(@Body() member: InvitataionDto) {
    const invitedMember = await this.boardService.inviteMember(member);

    return {
      statusCode: 201,
      message: '', //`${}를 ${}보드에 초대했습니다.`
      data: invitedMember,
    };
  }
}
