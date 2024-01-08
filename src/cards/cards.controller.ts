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


@ApiTags('카드')
@Controller('cards')
export class CardsController {
  constructor(private cardsService: CardsService) {}

  @Get()
  async getAllCards() {
    return await this.cardsService.getAllCards();
  }

  @Get(':cardId')
  async getCard(@Param('cardId') cardId: number) {
    return await this.cardsService.getCard(cardId);
  }
  
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post()
  async createCard(@Body() cardsDto: CardsDto, @Request() req) {
    const user_id = req.user.id;
    const careated_card = await this.cardsService.createCard(cardsDto, user_id);
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
    @Param('cardId') cardId: number,
    @Body() cardsDto: CardsDto,
    @Request() req,
  ) {
    const user_id = req.user.id;
    const updated_card = await this.cardsService.updateCard(
      cardId,
      cardsDto,
      user_id,
    );
    return updated_card;
  }


  @Delete(':cardId')
  async deleteCard(@Param('cardId') cardId: number, @Request() req) {
    const user_id = req.user.id;
    return await this.cardsService.deleteCard(cardId, user_id);
  }

  
}
