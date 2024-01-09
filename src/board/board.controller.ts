import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { BoardService } from './board.service';
import { BoardDto } from './dto/board.dto';
import { UpdateBoardDto } from './dto/updateBoard.dto';
import { InvitationDto } from './dto/invitation.dto';
import { CodeDto } from './dto/code.dto';
import { VerifyCodeDto } from 'src/auth/dtos/verify-code.dto';
import { EmailService } from 'src/email/email.service';
@Controller('board')
export class BoardController {
  constructor(
    private readonly boardService: BoardService,
    private readonly emailService: EmailService,
  ) {}

  // 허용된 사용자만 게시할 수 있는 데코레이터 추가
  // @UseGuards(AuthGuard('local'))
  @Post()
  async postBoard(@Body() boardDto: BoardDto) {
    try {
      const postedBoard = await this.boardService.postBoard(boardDto);

      return {
        statusCode: 201,
        message: '보드가 정상적으로 생성되었습니다.',
        data: postedBoard,
      };
    } catch (error) {
      return {
        statusCode: 400,
        message: '보드 생성에 실패했습니다.',
        error: error.message,
      };
    }
  }
  // 허용된 사용자만 수정할 수 있는 데코레이터 추가
  // @UseGuards(AuthGuard('local'))
  @Put(':boardId')
  async updateBoard(
    @Param('boardId') boardId: number,
    @Body() updateBoardDto: UpdateBoardDto,
  ) {
    try {
      const updatedBoard = await this.boardService.updateBoard(
        boardId,
        updateBoardDto,
      );

      return {
        satusCode: 201,
        //`${updatedBoard.name}보드가 정상적으로 변경되었습니다.`
        message: '보드가 정상적으로 변경되었습니다.',
        data: updatedBoard,
      };
    } catch (error) {
      return {
        statusCode: 400,
        message: '보드 변경에 실패했습니다.',
        error: error.message,
      };
    }
  }

  // 허용된 사용자만 삭제할 수 있는 데코레이터 추가
  // @UseGuards(AuthGuard('local'))
  @Delete(':boardId')
  async deleteBoard(@Param('boardId') boardId: number) {
    try {
      const deletedBoard = await this.boardService.deleteBoard(boardId);

      return {
        statusCode: 200,
        // `${deletedBoard.name} 보드가 정상적으로 삭제되었습니다.`
        message: '보드가 정상적으로 삭제되었습니다.',
        data: deletedBoard,
      };
    } catch (error) {
      return {
        statusCode: 400,
        message: '보드 삭제에 실패했습니다.',
        error: error.message,
      };
    }
  }

  // workspace 안 만들었기 때문에 하나씩만 조회 가능하도록 만듦.
  // 초대받은 사용자만 이용할 수 있도록 만들기
  // @UseGuards(AuthGuard('local'))
  @Get(':boardId')
  async getBoard(@Param('boardId') boardId: number) {
    try {
      const board = await this.boardService.findBoardById(boardId);

      return {
        statusCode: 200,
        message: '보드가 정상적으로 조회되었습니다.',
        data: board,
      };
    } catch (error) {
      return {
        statusCode: 400,
        message: '보드 조회에 실패했습니다.',
        error: error.message,
      };
    }
  }

  // @UseGuards(AuthGuard('local'))
  @Post('/invite')
  async inviteMember(@Body() invitationDto: InvitationDto) {
    try {
      const invitedMember = await this.boardService.inviteMember(invitationDto);

      return {
        statusCode: 201,
        message: `${invitedMember} 이메일로 초대 인증 메세지를 전송했습니다.`,
        data: invitedMember,
      };
    } catch (error) {
      return {
        statusCode: 400,
        message: '멤버 초대에 실패했습니다.',
        error: error.message,
      };
    }
  }

  // @UseGuards(AuthGuard('local'))
  @Post('checkMember')
  async checkMember(@Body() codeDto: CodeDto) {
    try {
      const { email, verificationCode, boardId } = codeDto;
      const result = await this.boardService.verifyCode(
        email,
        verificationCode,
        boardId,
      );

      return {
        statusCode: 200,
        message: '멤버 인증에 성공했습니다.',
        data: result,
      };
    } catch (error) {
      return {
        statusCode: 400,
        message: '멤버 인증에 실패했습니다.',
        error: error.message,
      };
    }
  }
}
