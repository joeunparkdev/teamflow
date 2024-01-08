import { IsNotEmpty, IsString } from 'class-validator';

export class BoardDto {
  @IsString()
  @IsNotEmpty({ message: '보드 이름을 입력해주세요.' })
  name: string;

  @IsString()
  @IsNotEmpty({ message: '배경색을 입력해주세요.' })
  backgroundColor: string;

  @IsString()
  @IsNotEmpty({ message: '보드 설명을 입력해주세요.' })
  description: string;
}
