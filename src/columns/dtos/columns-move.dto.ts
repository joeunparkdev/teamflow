import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class ColumnsMoveDto {
  @IsOptional()
  @IsNumber({}, { message: 'prev은 숫자여야 합니다.' })
  prev?: number;
  @IsOptional()
  @IsNumber({}, { message: 'next는 숫자여야 합니다.' })
  next?: number;
}
