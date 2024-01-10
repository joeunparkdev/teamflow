import { IsArray, IsDate, IsHexColor, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class UpdateCardsDto{
    @IsString()
    name:string|null;

    @IsString()
    description: string|null;

    @IsHexColor()
    color:string|null;

    @IsString()
    deadline: Date|null;

    @IsArray()
    assignedUserId:number[]|null;
    
    @IsNumber()
    cardPosition: number|null;

    @IsNumber()
    moveToColumnId: number;
    
}