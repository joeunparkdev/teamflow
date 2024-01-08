import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateCommentDto } from './dtos/create-comments.dto';
import { UpdateCommentsDto } from './dtos/update-comments.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('댓글')
@Controller('/cards/:cardId/comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  /**
   * 댓글 생성
   * @param commentsDto
   * @returns
   */
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post()
  async createComment(
    @Body() commentData: CreateCommentDto,
    @Param('cardId') cardId: number,
    @Req() req: any,
  ) {
    const data = await this.commentsService.createComment(
      req.user.id,
      cardId,
      commentData,
    );
    return {
      statusCode: HttpStatus.OK,
      message: '댓글 생성에 성공했습니다.',
      data,
    };
  }

  /**
   * 댓글 상세 보기
   * @returns
   */
  @Get()
  async getCommentsByCardId(@Param('cardId') cardId: number) {
    const data = await this.commentsService.getCommentsByCardId(cardId);
    return {
      statusCode: HttpStatus.OK,
      message: '댓글 상세 불러오기에 성공했습니다.',
      data,
    };
  }

  /**
   * 댓글 수정
   * @param commentsDto
   * @returns
   */
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Put('/:commentId')
  async updateOneComment(
    @Body() updateData: UpdateCommentsDto,
    @Param('commentId') commentId: number,
    @Req() req: any,
  ) {
    const data = await this.commentsService.updateOneComment(
      req.user.id,
      commentId,
      updateData,
    );
    return {
      statusCode: HttpStatus.OK,
      message: '댓글 수정에 성공했습니다.',
      data,
    };
  }

  /**
   * 댓글 삭제
   * @param commentsDto
   * @returns
   */
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete('/:commentId')
  async deleteOneComment(
    @Param('cardId') cardId: number,
    @Param('commentId') commentId: number,
    @Req() req: any,
  ) {
    const data = await this.commentsService.deleteOneComment(
      commentId,
      req.user.id,
    );
    return {
      statusCode: HttpStatus.OK,
      message: '댓글 삭제에 성공했습니다.',
      data,
    };
  }
}
