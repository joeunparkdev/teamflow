import {
  Body,
  Controller,
  Delete,
  Get,
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

@ApiTags('코멘트')
@Controller('/cards/:cardId/comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

   /**
   * 댓글 만들기
   * @param commentsDto
   * @returns
   */
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post()
  createComment(
    @Body() commentData: CreateCommentDto,
    @Param('cardId') cardId: number,
    @Req() req: any,
  ) {
    return this.commentsService.createComment(req.user.id, cardId, commentData);
  }

   /**
   * 댓글 상세 보기
   * @returns
   */
  @Get()
  getCommentsByCardId(@Param('cardId') cardId: number) {
    return this.commentsService.getCommentsByCardId(cardId);
  }

  /**
   * 댓글 수정
   * @param commentsDto
   * @returns
   */
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Put('/:commentId')
  updateOneComment(
    @Body() updateData: UpdateCommentsDto,
    @Param('commentId') commentId: number,
    @Req() req: any,
  ) {
    return this.commentsService.updateOneComment(
      commentId,
      req.user.id,
      updateData,
    );
  }

    /**
   * 댓글 삭제
   * @param commentsDto
   * @returns
   */
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete('/:commentId')
  deleteOneComment(
    @Param('cardId') cardId: number,
    @Param('commentId') commentId: number,
    @Req() req: any,
  ) {
    return this.commentsService.deleteOneComment(commentId, req.user.id);
  }
}
