import { IsArray, IsDate, IsHexColor, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CardsDto{
    @IsString()
    @IsNotEmpty({ message:"카드 이름을 작성해 주세요."})
    name:string;

    @IsString()
    description: string|null;

    @IsHexColor()
    color:string|null;

    @IsString()
    deadline: Date|null;

    @IsArray()
    assignedUserId:number[]|null;
    /*
    @IsString()
    status:string|null;
    */
}