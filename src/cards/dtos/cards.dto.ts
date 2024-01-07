import { IsArray, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CardsDto{
    @IsString()
    @IsNotEmpty({ message:"카드 이름을 작성해 주세요."})
    name:string;

    @IsString()
    description: string;

    @IsString()
    color:string;

    @IsString()
    deadline: Date;

    @IsArray()
    assignedUserId:string[];
    
    @IsString()
    status:string;
    
}