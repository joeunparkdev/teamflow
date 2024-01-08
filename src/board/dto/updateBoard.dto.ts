import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateBoardDto {
  @IsString()
  name: string;
  // name?: string 이런식으로 만들어야 하나?

  @IsString()
  backgroundColor: string;

  @IsString()
  description: string;
}
