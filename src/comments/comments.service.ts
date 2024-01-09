import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Comments } from '../comments/entities/comments.entity';
import { Repository } from 'typeorm';
import { CreateCommentDto } from './dtos/create-comments.dto';
import { UserService } from '../user/user.service';
import { CardsService } from '../cards/cards.service';
import { UpdateCommentsDto } from './dtos/update-comments.dto';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comments)
    private readonly commentsRepository: Repository<Comments>,
    private readonly userService: UserService,
  ) {}

  async createComment(
    userId: number,
    cardId: number,
    commentData: CreateCommentDto,
  ) {
    const user = await this.userService.findOneById(userId);
    if (!user) {
      throw new BadRequestException('댓글을 달 수 있는 권한이 없습니다');
    }
    const card = cardId;
    if (!card) {
      throw new BadRequestException('댓글을 달수있는 카드가 없습니다');
    }
    return await this.commentsRepository.save({
      userId,
      cardId,
      comment: commentData.comment,
    });
  }

  async getCommentsByCardId(cardId: number): Promise<Comments[]> {
    return await this.commentsRepository.find({
      where: {
        cardId,
      },
    });
  }

  async updateOneComment(
    userId: number,
    commentId: number,
    updateData: UpdateCommentsDto,
  ) {
    const user = await this.userService.findOneById(userId);
    console.log(user);
    if (!user) {
      throw new BadRequestException('댓글을 수정할수있는 권한이 없습니다.');
    }
    return await this.commentsRepository.update(
      {
        id: commentId,
      },
      { comment: updateData.comment },
    );
  }

  async deleteOneComment(commentId: number, userId: number) {
    const user = await this.userService.findOneById(userId);
    if (!user) {
      throw new BadRequestException('댓글을 삭제할 수 있는 권한이 없습니다.');
    }
    return await this.commentsRepository.delete({ id: commentId });
  }
}
