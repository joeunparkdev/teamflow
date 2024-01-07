import _ from 'lodash';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cards } from './entity/cards.entity';
import { CardsDto } from './dto/cards.dto';
import { User } from 'src/user/entities/user.entity';


@Injectable()
export class CardsService {
    constructor(
        @InjectRepository(Cards)
        private  cardsRepository: Repository<Cards>,
        @InjectRepository(User)
        private  userRepository: Repository<User>,
      ) {}

    async getAllCards():Promise<Cards[]>{
        const many_card= await this.cardsRepository.find({
            select:["id","name","orderNum"],
            order:{orderNum:"ASC"}
        });

        if(!many_card.length){
            throw new NotFoundException("카드가 없습니다.");
        }

        return many_card;
    }

    async getCard(cardId:number){
        const one_card=await this.verifyCardById(cardId);
        return one_card; 
    }

    async createCard(cardsDto:CardsDto,user_id:number){
        const cards_num=(await this.cardsRepository.find()).length;

        for(let i of cardsDto.assignedUserId){
           await this.verifyUserById(i);
        }

        await this.cardsRepository.save({
            name:cardsDto.name,
            description:cardsDto.description,
            color:cardsDto.color,
            deadline:cardsDto.deadline,
            assignedUserId:cardsDto.assignedUserId,
            orderNum: cards_num,
            status:cardsDto.status,
            createUserId:user_id,
        })
    }

    async updateCard(cardId:number,cardsDto:CardsDto,user_id:number){
        const one_card=await this.verifyCardById(cardId);
        await this.checkCard(one_card.createUserId,user_id)
        const updated_card=await this.cardsRepository.update({id:cardId},cardsDto);
        
        return updated_card;
    }

    async deleteCard(cardId:number,user_id:number){
        const one_card=await this.verifyCardById(cardId);
        await this.checkCard(one_card.createUserId,user_id)
        await this.cardsRepository.delete({id:cardId});
        
    }

    private async verifyUserById(userId:number){
        const one_user= await this.userRepository.findOneBy({id:userId});
        if(_.isNil(one_user)){
            throw new NotFoundException("존재하지 않는 사용자 입니다.");
        }
        return one_user;
    }

    private async verifyCardById(cardId:number){
        const one_card= await this.cardsRepository.findOneBy({id:cardId});
        if(_.isNil(one_card)){
            throw new NotFoundException("존재하지 않는 카드 입니다.");
        }
        return one_card;
    }

    private async checkCard(createUserId:number,user_id:number){
        if(createUserId!=user_id){
            throw new NotFoundException("해당 카드를 수정할 수 없습니다.")
        }
    }
}
