import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Put,
  Req,
  Request,
  UseGuards,
} from '@nestjs/common';
import { CardsService } from './cards.service';
import { CardsDto } from './dtos/cards.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

import { CreateCommentDto } from '../comments/dtos/create-comments.dto';
import { UpdateCommentsDto } from '../comments/dtos/update-comments.dto';

import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UpdateCardsDto } from './dtos/update-cards.dto';
import { number } from 'joi';

@ApiTags('카드')
@Controller('/column/:columnId/cards')
export class CardsController {
  constructor(private cardsService: CardsService) {}
  /**
   * 전체 카드 가져오기
   * @param columnId
   * @returns
   */
  @Get()
  async getAllCards(@Param('columnId') columnId: number) {
    try {
      const cards = await this.cardsService.getAllCards(columnId);
      return {
        statusCode: 200,
        message: '전체 카드 정상적으로 조회되었습니다.',
        data: cards,
      };
    } catch (error) {
      return {
        statusCode: 400,
        message: '전체 카드 조회에 실패했습니다.',
        error: error.message,
      };
    }
  }

  /**
   * 특정 카드 가져오기
   * @param columnId
   * @param cardId
   * @returns
   */
  @Get(':cardId')
  async getCard(
    @Param('columnId') columnId: number,
    @Param('cardId') cardId: number,
  ) {
    try {
      const card = await this.cardsService.getCard(cardId);

      return {
        statusCode: 200,
        message: '카드 정상적으로 조회되었습니다.',
        data: card,
      };
    } catch (error) {
      return {
        statusCode: 400,
        message: '카드 조회에 실패했습니다.',
        error: error.message,
      };
    }
  }

  /**
   * 카드 생성
   * @param columnId
   * @Body cardsDto
   * @Request req
   * @returns
   */
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post()
  async createCard(
    @Body() cardsDto: CardsDto,
    @Request() req,
    @Param('columnId') columnId: number,
  ) {
    try{
    const user_id = req.user.id;
    const careated_card = await this.cardsService.createCard(
      cardsDto,
      user_id,
      columnId,
    );
    return {
      statusCode: 200,
      message: '카드 정상적으로 생성되었습니다.',
      data: careated_card ,
    };
  } catch (error) {
    return {
      statusCode: 400,
      message: '카드 생성에 실패했습니다.',
      error: error.message,
    };
  }
}

  /**
   * 카드 수정
   * @param columnId
   * @param cardId
   * @body updateCardsDto
   * @req req
   * @returns
   */
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Put(':cardId')
  async updateCard(
    @Param('columnId') columnId: number,
    @Param('cardId') cardId: number,
    @Body() updateCardsDto: UpdateCardsDto,
    @Request() req,
  ) {
    try{
    const user_id = req.user.id;
    const updated_card = await this.cardsService.updateCard(
      columnId,
      cardId,
      updateCardsDto,
      user_id,
    );
    return {
      statusCode: 200,
      message: '카드 정상적으로 수정되었습니다.',
      data: updated_card ,
    };
  } catch (error) {
    return {
      statusCode: 400,
      message: '카드 수정에 실패했습니다.',
      error: error.message,
    };
  }
}
  /**
   * 카드 삭제
   * @param columnId
   * @param cardId
   * @req req
   * @returns
   */
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete(':cardId')
  async deleteCard(
    @Param('columnId') columnId: number,
    @Param('cardId') cardId: number,
    @Request() req,
  ) {
    const user_id = req.user.id;
    const deletedCard = await this.cardsService.deleteCard(cardId, user_id);
    return {
      statusCode: 200,
      message: '카드가 정상적으로 삭제되었습니다.',
      data: deletedCard,
    };
  }
  catch(error) {
    return {
      statusCode: 400,
      message: '카드 삭제에 실패했습니다.',
      error: error.message,
    };
  }
}
