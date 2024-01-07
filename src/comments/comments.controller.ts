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
import { createCommentDto } from '../cards/dto/create-comments.dto';
import { UpdateCommentsDto } from '../cards/dto/update-comments.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('코멘트')
@Controller('/cards/:cardId/comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  // localhost:3000/comments/1(:cardId)
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post()
  createComment(
    @Body() commentData: createCommentDto,
    @Param('cardId') cardId: number,
    @Req() req: any,
  ) {
    return this.commentsService.createComment(req.user.id, cardId, commentData);
  }

  @Get()
  getCommentsByCardId(@Param('cardId') cardId: number) {
    return this.commentsService.getCommentsByCardId(cardId);
  }

  // getCommentsByCardId
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
