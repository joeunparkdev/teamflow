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
import { CardsDto } from './dto/cards.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { createCommentDto } from './dto/create-comments.dto';
import { UpdateCommentsDto } from './dto/update-comments.dto';
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

  // localhost:3000/comments/1(:cardId)
  // @ApiBearerAuth()
  // @UseGuards(JwtAuthGuard)
  // @Post(':cardId/comments')
  // createComment(
  //   @Body() commentData: createCommentDto,
  //   @Param('cardId') cardId: number,
  //   @Req() req: any,
  // ) {
  //   return this.cardsService.createComment(req.user.id, cardId, commentData);
  // }

  // @Get(':cardId/comments')
  // getCommentsByCardId(@Param('cardId') cardId: number) {
  //   return this.cardsService.getCommentsByCardId(cardId);
  // }

  // // getCommentsByCardId
  // @ApiBearerAuth()
  // @UseGuards(JwtAuthGuard)
  // @Put(':cardId/comments/:commentId')
  // updateOneComment(
  //   @Body() updateData: UpdateCommentsDto,
  //   @Param('commentId') commentId: number,
  //   @Req() req: any,
  // ) {
  //   return this.cardsService.updateOneComment(
  //     commentId,
  //     req.user.id,
  //     updateData,
  //   );
  // }
  // @ApiBearerAuth()
  // @UseGuards(JwtAuthGuard)
  // @Delete(':cardId/comments/:commentId')
  // deleteOneComment(
  //   @Param('cardId') cardId: number,
  //   @Param('commentId') commentId: number,
  //   @Req() req: any,
  // ) {
  //   return this.cardsService.deleteOneComment(cardId, commentId, req.user.id);
  // }
}
