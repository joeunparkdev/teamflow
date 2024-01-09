/*
import _ from 'lodash';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cards } from './entities/cards.entity';
import { CardsDto } from './dtos/cards.dto';
import { User } from 'src/user/entities/user.entity';
import { CreateCommentDto } from '../comments/dtos/create-comments.dto';
import { Comments } from '../comments/entities/comments.entity';
import { UpdateCommentsDto } from '../comments/dtos/update-comments.dto';
import { UserService } from '../user/user.service';
*/

import _ from 'lodash';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cards } from './entities/cards.entity';
import { CardsDto } from './dtos/cards.dto';
import { User } from 'src/user/entities/user.entity';
import { Columns } from 'src/columns/entities/columns.entity';
import { UpdateCardsDto } from './dtos/update-cards.dto';

@Injectable()
export class CardsService {
  constructor(
    @InjectRepository(Cards)
    private cardsRepository: Repository<Cards>,
    //@InjectRepository(Comments)
    //private readonly commentsRepository: Repository<Comments>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    //private readonly userService: UserService,
    @InjectRepository(Columns)
    private  columnsRepository: Repository<Columns>,
  ) {}

  async getAllCards(columnId:number) {
    const many_card: any = await this.verifyAllCards(columnId);
    return many_card;
  }

  async getCard(cardId: number) {
    const one_card = await this.verifyCardById(cardId);
    return one_card;
  }

  async createCard(cardsDto:CardsDto,user_id:number,columnId:number){
    //const cards_num:number=(await this.cardsRepository.find()).length;
    const many_card = await this.verifyAllCards(columnId);
    const cards_num :number=Number(many_card[many_card.length-1].orderNum)+1

    for(let i of cardsDto.assignedUserId){
       await this.verifyUserById(i);
    }

    const column= await this.verifyColumnById(columnId);
    
    await this.cardsRepository.save({
        name:cardsDto.name,
        description:cardsDto.description,
        color:cardsDto.color,
        deadline:cardsDto.deadline,
        assignedUserId:cardsDto.assignedUserId,
        status:column.name,
        columnId:column.id,
        orderNum: cards_num,
        createUserId:user_id,
    })
}

  async updateCard(columnId:number,cardId: number, updateCardsDto: UpdateCardsDto, user_id: number) {
    const one_card = await this.verifyCardById(cardId);
    await this.checkCard(one_card.createUserId, user_id);

    const many_card= await this.verifyAllCards(columnId);
    const update_orderNum=Math.floor(updateCardsDto.orderNum);

    //이동하려는 장소 orderNum이 0~마지막 카드의 orderNum인데 넘어가면 orderNumㅇ 
    if(update_orderNum>many_card[many_card.length-1].orderNum){
      updateCardsDto.orderNum=many_card[many_card.length-1].orderNum;
    }
    else if(updateCardsDto.orderNum<0){
      updateCardsDto.orderNum=0;
    }




    /*
    //카드를 현재보다 위로 이동했을 때 1 0
    //one_card.orderNum와 updateCardsDto.orderNum 사이의 orderNum값을 -1해줌
    if(one_card.orderNum>updateCardsDto.orderNum){
      console.log("시작위치"+Number(updateCardsDto.orderNum)+1)
      console.log("도착위치"+Number(one_card.orderNum)+1)
      for(let i:number=Number(updateCardsDto.orderNum);i<Number(one_card.orderNum);i++){
        console.log(i);
        await this.cardsRepository.update({orderNum:i},{orderNum:Number(i)+1})
      }
      await this.cardsRepository.update({id:cardId},updateCardsDto)

    }//카드를 현재보다 밑으로 이동했을 때
    //one_card.orderNum와 updateCardsDto.orderNum 사이의 orderNum값을 +1해줌
    else if(one_card.orderNum<updateCardsDto.orderNum){
      for(let i:number=Number(one_card.orderNum);i<Number(updateCardsDto.orderNum)+1;i++){
        await this.cardsRepository.update({orderNum:i},{orderNum:i-1})
      }
      await this.cardsRepository.update({id:cardId},updateCardsDto)
    }
    */

    //const updated_card = await this.cardsRepository.update({ id: cardId },updateCardsDto,);

    
  }
  
  async deleteCard(cardId: number, user_id: number) {
    const one_card = await this.verifyCardById(cardId);

    await this.checkCard(one_card.createUserId, user_id);
    await this.cardsRepository.delete({ id: cardId });
  }

  private async verifyUserById(userId:number){
    const one_user= await this.userRepository.findOneBy({id:userId});
    if(_.isNil(one_user)){
        throw new NotFoundException("할당 하려는 사용자는 존재하지 않습니다.");
    }
    return one_user;
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
      throw new NotFoundException('해당 카드를 수정/삭제할 수 없습니다.');
    }

  }
  
  private async verifyColumnById(columnId:number){
   
    if (isNaN(columnId) || !Number.isInteger(columnId)) {
      throw new BadRequestException('올바르지 않은 컬럼 식별자입니다.');
  }

    const one_column=await this.columnsRepository.findOneBy({id:columnId});
    if(_.isNil(one_column)){
      throw new NotFoundException("해당하는 컬럼은 존재하지 않습니다");
    }

    return one_column;

  }

  private async verifyAllCards(columnId:number){
    const many_card =await this.cardsRepository.find({
      where:{columnId}, 
      select: ['id', 'name', 'orderNum'],
      order: { orderNum: 'ASC' },});

      if (!many_card.length) {
        throw new NotFoundException('카드가 없습니다.');
      }

    return many_card;
  }

/*
  private async verifyStatus(column_name:string[],status:string){
    const check_status= await column_name.find((e)=>{e==status});
    if(!check_status){
      throw new NotFoundException("해당하는 이름의 칼럼이 존재하지 않습니다")
    }
  }



  async createComment(
    userId: number,
    cardId: number,
    commentData: CreateCommentDto,
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
      .addSelect('comments.comment', 'comment')
      .innerJoin('comments.user', 'user')
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
  }*/
}
