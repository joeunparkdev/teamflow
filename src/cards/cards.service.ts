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
    private columnsRepository: Repository<Columns>,
  ) {}

  async getAllCards(columnId: number) {
    const many_card: any = await this.verifyAllCards(columnId);
    return many_card;
  }

  async getCard(cardId: number) {
    const one_card = await this.verifyCardById(cardId);
    return one_card;
  }

  async createCard(cardsDto: CardsDto, user_id: number, columnId: number) {
    //const cards_num:number=(await this.cardsRepository.find()).length;
    const many_card = await this.cardsRepository.find({
      where: { columnId },
      select: ['id', 'name', 'orderNum'],
      order: { orderNum: 'ASC' },
    });

    let cards_num: number;
    many_card.length > 0
      ? (cards_num = Number(many_card[many_card.length - 1].orderNum) + 1)
      : (cards_num = 1);

    for (let i of cardsDto.assignedUserId) {
      await this.verifyUserById(i);
    }

    const column = await this.verifyColumnById(columnId);

    await this.cardsRepository.save({
      name: cardsDto.name,
      description: cardsDto.description,
      color: cardsDto.color,
      deadline: cardsDto.deadline,
      assignedUserId: cardsDto.assignedUserId,
      status: column.name,
      columnId: column.id,
      orderNum: cards_num,
      createUserId: user_id,
    });
  }

  async updateCard(
    columnId: number,
    cardId: number,
    updateCardsDto: UpdateCardsDto,
    user_id: number,
  ) {
    //이거는 같은 컬럼에서의 이동
    const one_card = await this.verifyCardById(cardId);
    await this.checkCard(one_card.createUserId, user_id);
    //const column_by_name = await this.verifyColumnByName(updateCardsDto.status);//다른컬럼으로 이동시 업데이트 상태로 columnId를 받는다

    //const column_id =column_by_name[0].id;

    const many_card = await this.cardsRepository.find({
      where: { columnId: updateCardsDto.moveToColumnId },
      select: ['id', 'name', 'orderNum'],
      order: { orderNum: 'ASC' },
      relations: { comments: true },
    });

    if (!many_card.length) {
      await this.cardsRepository.update(
        { id: cardId },
        {
          name: updateCardsDto.name,
          description: updateCardsDto.description,
          color: updateCardsDto.color,
          deadline: updateCardsDto.deadline,
          assignedUserId: updateCardsDto.assignedUserId,
          orderNum: 0,
          columnId: updateCardsDto.moveToColumnId,
        },
      );
      return;
    }

    let cardMovePosition = Math.floor(updateCardsDto.cardPosition); //카드가 이동할 위치

    let updateOrderNum: number;

    //이동하려는 장소 orderNum이 0~마지막 카드의 orderNum인데 넘어가면 orderNumㅇ
    if (cardMovePosition > many_card[many_card.length - 1].orderNum) {
      //가장뒤로 갈떄

      updateOrderNum = Number(many_card[many_card.length - 1].orderNum) + 1; //가장 뒤에있는 카드의 위치값+1
    } else if (cardMovePosition < many_card[0].orderNum) {
      //가장 앞으로 갈 때 hoppers

      updateOrderNum = Number(many_card[0].orderNum) / 2; //0번째 카드의 위치값/2
    } else {
      //그 외 가고싶은 위치의 앞뒤 카드의 위치/2
      updateOrderNum =
        (Number(many_card[cardMovePosition - 1].orderNum) +
          Number(many_card[cardMovePosition].orderNum)) /
        2;
    }

    await this.cardsRepository.update(
      { id: cardId },
      {
        name: updateCardsDto.name,
        description: updateCardsDto.description,
        color: updateCardsDto.color,
        deadline: updateCardsDto.deadline,
        assignedUserId: updateCardsDto.assignedUserId,
        orderNum: updateOrderNum,
        columnId: updateCardsDto.moveToColumnId,
      },
    );
  }

  async deleteCard(cardId: number, user_id: number) {
    const one_card = await this.verifyCardById(cardId);

    await this.checkCard(one_card.createUserId, user_id);
    await this.cardsRepository.delete({ id: cardId });
  }

  private async verifyUserById(userId: number) {
    const one_user = await this.userRepository.findOneBy({ id: userId });
    if (_.isNil(one_user)) {
      throw new NotFoundException('할당 하려는 사용자는 존재하지 않습니다.');
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

  private async verifyColumnById(columnId: number) {
    if (isNaN(columnId) || !Number.isInteger(columnId)) {
      throw new BadRequestException('올바르지 않은 컬럼 식별자입니다.');
    }

    const one_column = await this.columnsRepository.findOne({
      where: { id: columnId },
    });
    if (_.isNil(one_column)) {
      throw new NotFoundException('해당하는 컬럼은 존재하지 않습니다');
    }

    return one_column;
  }

  private async verifyAllCards(columnId: number) {
    const many_card = await this.cardsRepository.find({
      where: { columnId },
      select: ['id', 'name', 'orderNum'],
      order: { orderNum: 'ASC' },
      relations: { comments: true },
    });

    if (!many_card.length) {
      throw new NotFoundException('카드가 없습니다.');
    }

    return many_card;
  }

  private async verifyColumnByName(columnName: string) {
    //이름으로 컬럼 id찾기
    const many_card = await this.columnsRepository.find({
      where: { name: columnName },
      select: ['id'],
    });

    if (!many_card.length) {
      throw new NotFoundException(
        '그 러한 이름의 컬럼은 존재하지 않습니다 status를 다시 작성해 주세요',
      );
    }

    return many_card;
  }
}
