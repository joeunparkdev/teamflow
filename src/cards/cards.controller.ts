import { Controller, Post, Patch, Delete, Param, Body, Get,UseGuards, Put, Request } from '@nestjs/common';
import { CardsService } from './cards.service';
import { CardsDto } from './dto/cards.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';


@Controller('cards')
export class CardsController {
    constructor(private cardsService: CardsService) {}

    @Get()
    async getAllCards(){
        return await this.cardsService.getAllCards();
    }

    @Get(":cardId")
    async getCard(@Param('cardId') cardId: number){
        return await this.cardsService.getCard(cardId);
    }

    @UseGuards(JwtAuthGuard)
    @Post()
    async createCard(@Body() cardsDto: CardsDto,@Request() req){
        const user_id=req.user.id;
        const careated_card=await this.cardsService.createCard(cardsDto,user_id);
        return careated_card;
        }

    @UseGuards(JwtAuthGuard)
    @Put(":cardId")
    async updateCard(@Param("cardId")cardId:number,@Body() cardsDto:CardsDto,@Request() req){
        const user_id=req.user.id;
        const updated_card=await this.cardsService.updateCard(cardId,cardsDto,user_id);
        return updated_card;
    }

    @UseGuards(JwtAuthGuard)
    @Delete(":cardId")
    async deleteCard(@Param("cardId")cardId:number,@Request() req){
        const user_id=req.user.id;
        return await this.cardsService.deleteCard(cardId,user_id);
    }
}



