import _ from 'lodash';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cards } from './entities/cards.entity';
import { CardsDto } from './dto/cards.dto';
import { User } from 'src/user/entities/user.entity';
import { createCommentDto } from './dto/create-comments.dto';
import { Comments } from './entities/comments.entity';
import { UpdateCommentsDto } from './dto/update-comments.dto';
import { UserService } from '../user/user.service';

@Injectable()
export class CardsService {
  constructor(
    @InjectRepository(Cards)
    private cardsRepository: Repository<Cards>,
    @InjectRepository(Comments)
    private readonly commentsRepository: Repository<Comments>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly userService: UserService,
  ) {}

  async getAllCards(): Promise<Cards[]> {
    const many_card = await this.cardsRepository.find({
      select: ['id', 'name', 'orderNum'],
      order: { orderNum: 'ASC' },
    });

    if (!many_card.length) {
      throw new NotFoundException('카드가 없습니다.');
    }

    return many_card;
  }

  async getCard(cardId: number) {
    const one_card = await this.verifyCardById(cardId);
    return one_card;
  }

  async createCard(cardsDto: CardsDto, user_id: number) {
    const cards_num = (await this.cardsRepository.find()).length;
    const user_ids = await this.userRepository.find({ select: ['id'] });
    /* cardsDto.assignedUserId.map((e)=>{
         user_ids.find((uid)=>uid==e);
     })*/

    await this.cardsRepository.save({
      name: cardsDto.name,
      description: cardsDto.description,
      color: cardsDto.color,
      deadline: cardsDto.deadline,
      assignedUserId: cardsDto.assignedUserId,
      orderNum: cards_num,
      status: cardsDto.status,
      createUserId: user_id,
    });
  }

  async updateCard(cardId: number, cardsDto: CardsDto, user_id: number) {
    const one_card = await this.verifyCardById(cardId);
    await this.checkCard(one_card.createUserId, user_id);
    const updated_card = await this.cardsRepository.update(
      { id: cardId },
      cardsDto,
    );

    return updated_card;
  }

  async deleteCard(cardId: number, user_id: number) {
    const one_card = await this.verifyCardById(cardId);
    await this.checkCard(one_card.createUserId, user_id);
    await this.cardsRepository.delete({ id: cardId });
  }

  private async verifyCardById(cardId: number) {
    const one_card = await this.cardsRepository.findOneBy({ id: cardId });
    if (_.isNil(one_card)) {
      throw new NotFoundException('존재하지 않는 카드 입니다.');
    }
    return one_card;
  }

  private async checkCard(createUserId: number, user_id: number) {
    if (createUserId != user_id) {
      throw new NotFoundException('해당 카드를 수정할 수 없습니다.');
    }
  }

  async createComment(
    userId: number,
    cardId: number,
    commentData: createCommentDto,
  ) {
    const user = await this.userService.findOneById(userId);
    if (!user) {
      throw new BadRequestException('댓글을 달 수 있는 권한이 없습니다');
    }
    const card = await this.getCard(cardId);
    if (!card) {
      throw new BadRequestException('댓글을 달수있는 카드가 없습니다');
    }
    await this.commentsRepository.save(
      this.commentsRepository.create({
        user: {
          id: userId,
        },
        card: {
          id: cardId,
        },
        comment: commentData.comment,
      }), // create() => Comments Entity 객체
    ); // save() => Comments Entity 객체를 INSERT

    // await this.cardsService.
    // array = [1번 요소, 2번 요소, 3번 요소]
    // array.map(item => {}); => 1번, 2번, 3번 요소가 순서 상관없이 동시에 시작(비동기)
    // for (const item of array) { }
  }

  getCommentsByCardId(cardId: number): Promise<Comments[]> {
    return this.commentsRepository
      .createQueryBuilder('comment')
      .select('comment.id', 'id')
      .addSelect('user.id', 'userId')
      .addSelect('card.id', 'cardId')
      .addSelect('comment.comment', 'comment')
      .innerJoin('comment.user', 'user')
      .innerJoin('comment.card', 'card')
      .where('card.id = :id', {
        id: cardId,
      })
      .getRawMany();
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

  async deleteOneComment(cardId: number, commentId: number, userId: number) {
    const user = await this.userService.findOneById(userId);
    if (!user) {
      throw new BadRequestException('댓글을 삭제할 수 있는 권한이 없습니다.');
    }
    const card = await this.getCard(cardId);
    if (!card) {
      throw new BadRequestException('댓글을 삭제할 수 있는 카드가 없습니다');
    }
    return this.commentsRepository.delete({ id: commentId });
  }

  async updateDeadline(cardId: number, userId: number, deadline: Date) {
    await this.verifyAssignedUser(cardId, userId);
    const user = await this.userService.findOneById(userId);
    if (!user) {
      throw new BadRequestException('마감일을 수정할 수 있는 권한이 없습니다.');
    }
    return this.cardsRepository.update(cardId, { deadline });
  }

  // cardId의 할당된 사용자인지 여부 확인
  async verifyAssignedUser(cardId: number, userId: number) {
    // cardId를 통해 card 객체 반환
    const card = await this.getCard(cardId);
    // card 객체가 존재하지 않는 경우 예외 메시지 출력
    if (!card) {
      throw new BadRequestException('카드가 존재하지 않습니다.');
    }

    // assignedUserIds.map(Number) => [ '1', '2' ].map(Number) => [ 1, 2 ]
    // .map(Number) 문자형 배열을 숫자형 배열로 형 변환
    const assignedUserIds = card.assignedUserId.map(Number);

    // array.includes(item);
    // 할당된 사용자가 아닌 경우 예외 메시지 출력
    if (!assignedUserIds.includes(userId)) {
      throw new UnauthorizedException('할당되지 않은 유저입니다.');
    }
  }
}
