import { IsNotEmpty, IsString } from 'class-validator';

export class CodeDto {
  @IsString()
  @IsNotEmpty({ message: '인증 코드를 입력해주세요.' })
  code: string;
}