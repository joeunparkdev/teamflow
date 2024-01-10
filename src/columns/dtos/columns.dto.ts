import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class ColumnsDto {
  @IsNotEmpty({ message: '컬럼 이름을 입력해 주세요.' })
  @IsString({ message: '컬럼 이름은 문자열이어야 합니다.' })
  name: string;

}
