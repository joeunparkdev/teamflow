import { IsNotEmpty, IsString } from 'class-validator';

export class InvitataionDto {
  @IsString()
  @IsNotEmpty({ message: '멤버 이름을 입력해주세요.' })
  member: string;
}
