import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { createCommentDto } from './dto/create-comments.dto';
import { UpdateCommentsDto } from './dto/update-comments.dto';

@UseGuards(JwtAuthGuard)
@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  // localhost:3000/comments/1(:cardId)
  @Post(':cardId')
  createComment(
    @Body() commentData: createCommentDto,
    @Param('cardId') cardId: number,
    @Req() req: any,
  ) {
    return this.commentsService.createComment(req.user.id, cardId, commentData);
  }

  @Get(':cardId')
  getCommentsByCardId(@Param('cardId') cardId: number) {
    return this.commentsService.getCommentsByCardId(cardId);
  }
  // getCommentsByCardId

  @Patch(':cardId/:commentId')
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

  @Delete(':commentId')
  deleteOneComment(@Param('commentId') commentId: number, @Req() req: any) {
    return this.commentsService.deleteOneComment(commentId, req.user.id);
  }
}
