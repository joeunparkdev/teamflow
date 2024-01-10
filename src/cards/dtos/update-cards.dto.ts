import {
  IsArray,
  IsDate,
  IsHexColor,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';

export class UpdateCardsDto {
  /**
   * 카드 이름
   * @example "깃허브 계정 생성"
   */
  @IsString()
  name: string | null;
  /**
   * 설명
   * @example "구글 이메일 이용"
   */
  @IsString()
  description: string | null;
  /**
   * 색
   * @example "fff000"
   */
  @IsHexColor()
  color: string | null;
  /**
   * 날짜
   *    * @example "Tue Jan 16 2024 19:58:06 GMT+0900 (Korean Standard Time)"
   */
  @IsString()
  deadline: Date | null;

  /**
   * 유저 아이디
   *    * @example "[1]"
   */
  @IsArray()
  assignedUserId: number[] | null;

  /**
   * 카드 이동할 위치   *    * @example "1"
   */
  @IsNumber()
  cardPosition: number | null;
    
  /*
  * 카드가 이동할 칼럼 
  *    * @example "1"
  */
  @IsNumber()
  moveToColumnId: number;
    
}

