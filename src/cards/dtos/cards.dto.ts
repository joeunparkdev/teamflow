import {
  IsArray,
  IsDate,
  IsHexColor,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';

export class CardsDto {
  /**
   * 카드 이름
   * @example "깃허브 계정 생성"
   */
  @IsString()
  @IsNotEmpty({ message: '카드 이름을 작성해 주세요.' })
  name: string;

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
  @IsNumber()
  assignedUserId: number | null;
}
