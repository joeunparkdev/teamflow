import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Comments } from '../comments/entities/comments.entity';
import { Repository } from 'typeorm';
import { createCommentDto } from '../cards/dto/create-comments.dto';
import { UserService } from '../user/user.service';
import { CardsService } from '../cards/cards.service';
import { UpdateCommentsDto } from '../cards/dto/update-comments.dto';

/*
*
INSERT INTO teamflow.cards (name,description,color,deadline,assigned_user_id,order_num,status,create_user_id)
VALUES('kim','this is my project','pink','1월12일','그건나',30,'진행중',2)
*
* */

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
    commentData: createCommentDto,
  ) {
    const user = await this.userService.findOneById(userId);
    if (!user) {
      throw new BadRequestException('댓글을 달 수 있는 권한이 없습니다');
    }
    const card = 1;
    if (!card) {
      throw new BadRequestException('댓글을 달수있는 카드가 없습니다');
    }
    await this.commentsRepository.save({
      userId,
      cardId,
    });
  }

  getCommentsByCardId(cardId: number): Promise<Comments[]> {
    return this.commentsRepository.find({
      where: {
        cardId,
      },
    });
  }

  // id, user_id, card_id, comments
  // select * from comments; => comments 테이블에 있는 모든 데이터와 열(id, user_id, card_id, comments)을 선택
  // select id, user_id from comments; comments 테이블에 있는 모든 데이터와 열(id, user_id)을 선택
  // id => select(id)
  // user_id => addSelect(userId)

  async updateOneComment(
    userId: number,
    commentId: number,
    updateData: UpdateCommentsDto,
  ) {
    const user = await this.userService.findOneById(userId);
    if (!user) {
      throw new BadRequestException('댓글을 수정할수있는 권한이 없습니다.');
    }
    return this.commentsRepository.update(
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
    return this.commentsRepository.delete({ id: commentId });
  }
}
