import { Controller, Delete, Get, Param, Patch, Post } from "@nestjs/common";
import { CommentsService } from "./comments.service";

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {
  }
@Post (':cardId')
  createComment(@Param('cardId')) {
  return this.commentsService.createComment();
}
  @Get(':cardId')
  getCommentById(@Param('cardId')){
    return this.commentsService.getCommentById();
  }
  @Patch(':cardId/:commentId')
  updateOneComment(@Param('commentId')){
    return this.commentsService.updateOneComment();
  }
  @Delete(':cardId/:commentId')
  deleteOneComment(@Param('commentId')){
    return this.commentsService.deleteOneComment();
  }



}
