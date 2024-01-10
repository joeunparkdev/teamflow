import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
  Request,
} from '@nestjs/common';
import { BoardService } from './board.service';
import { BoardDto } from './dto/board.dto';
import { UpdateBoardDto } from './dto/updateBoard.dto';
import { InvitationDto } from './dto/invitation.dto';
import { CodeDto } from './dto/code.dto';
import { VerifyCodeDto } from '../auth/dtos/verify-code.dto';
import { EmailService } from '../email/email.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('보드')
@Controller('board')
export class BoardController {
  constructor(
    private readonly boardService: BoardService,
    private readonly emailService: EmailService,
  ) {}
  /**
   * 보드 생성
   * @request req
   * @body boardDto
   * @returns
   */
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post()
  async postBoard(@Request() req, @Body() boardDto: BoardDto) {
    try {
      const userId = req.user.id;
      const postedBoard = await this.boardService.postBoard(userId, boardDto);

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

  /**
   * 보드 수정
   * @param boardId
   * @body updateBoardDto
   * @req req
   * @returns
   */
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Put(':boardId')
  async updateBoard(
    @Request() req,
    @Param('boardId') boardId: number,
    @Body() updateBoardDto: UpdateBoardDto,
  ) {
    try {
      const userId = req.user.id;
      const updatedBoard = await this.boardService.updateBoard(
        userId,
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
  /**
   * 보드 삭제
   * @param boardId
   * @req req
   * @returns
   */
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete(':boardId')
  async deleteBoard(@Request() req, @Param('boardId') boardId: number) {
    try {
      const userId = req.user.id;

      const deletedBoard = await this.boardService.deleteBoard(userId, boardId);

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

  /**
   * 특정 보드 가져오기
   * @param boardId
   * @returns
   */
  // workspace 안 만들었기 때문에 하나씩만 조회 가능하도록 만듦.
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

  /**
   * 초대하기
   * @param invitationDto
   * @Request req
   * @returns
   */
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('/invite')
  async inviteMember(@Body() invitationDto: InvitationDto, @Request() req) {
    try {
      const userId = req.user.id;
      const invitedMember = await this.boardService.inviteMember(
        invitationDto,
        userId,
      );

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

  /**
   * 멤버 확인하기
   * @Body codeDto
   * @returns
   */
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('checkMember')
  async checkMember(@Body() codeDto: CodeDto, @Request() req) {
    try {
      const { email, verificationCode, boardId } = codeDto;
      const userId = req.user.id;
      const result = await this.boardService.verifyCode(
        email,
        verificationCode,
        boardId,
        userId,
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
