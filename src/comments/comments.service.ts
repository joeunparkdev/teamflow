import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CommentEntity } from "./entities/comment.entity";
import { Repository } from "typeorm";

/*
*
INSERT INTO teamflow.cards (name,description,color,deadline,assigned_user_id,order_num,status,create_user_id)
VALUES('kim','this is my project','pink','1월12일','그건나',30,'진행중',2)
*
* */

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(CommentEntity)
    private readonly commentsRepository: Repository<CommentEntity>,
    private readonly commentsService: CommentsService,
    private readonly cardsService: CardsService
  ) {
  }

  async createComment(cardId: number) {


  }

  getCommentById(cardId: number): Promise<CommentEntity> {
    return this.commentsRepository;
  }

  updateOneComment(cardId: number, commentId: number, updateData: UpdatecommnetDto) {
  return this.commentsRepository.update{
    card: {id : cardId},
      comment:{id:commentId},
      comment: updateData.comment,
    },
    {
      comment: updateData.comment
    }
  }

  deleteOneComment() {

  }
}
