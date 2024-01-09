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
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

import { CreateCommentDto } from '../comments/dtos/create-comments.dto';
import { UpdateCommentsDto } from '../comments/dtos/update-comments.dto';

import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UpdateCardsDto } from './dtos/update-cards.dto';
import { number } from 'joi';


@ApiTags('카드')
@Controller('/column/:columnId/cards')
export class CardsController {
  constructor(private cardsService: CardsService) {}

  @Get()
  async getAllCards(@Param("columnId") columnId:number) {
    return await this.cardsService.getAllCards(columnId);
  }

  @Get(':cardId')
  async getCard(@Param('cardId') cardId: number) {
    return await this.cardsService.getCard(cardId);
  }
  
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post()
  async createCard(@Body() cardsDto: CardsDto, @Request() req, @Param("columnId") columnId:number) {
    const user_id = req.user.id;
    const careated_card = await this.cardsService.createCard(cardsDto, user_id,columnId);
    return {
      statusCode: HttpStatus.OK,
      message: '카드 생성에 성공했습니다.',
      careated_card,
    };
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Put(':cardId')
  async updateCard(
    @Param("columnId") columnId:number,
    @Param('cardId') cardId: number,
    @Body() updateCardsDto: UpdateCardsDto,
    @Request() req,
  ) {
    const user_id = req.user.id;
    const updated_card = await this.cardsService.updateCard(
      columnId,
      cardId,
      updateCardsDto,
      user_id,
    );
    return updated_card;
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete(':cardId')
  async deleteCard(@Param("columnId") columnId:number,@Param('cardId') cardId: number, @Request() req) {
    const user_id = req.user.id;
    return await this.cardsService.deleteCard(cardId, user_id);
  }

  
}
