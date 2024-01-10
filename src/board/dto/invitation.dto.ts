import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class InvitationDto {
  @IsEmail()
  @IsNotEmpty({ message: '초대받을 사람의 이메일을 작성해주세요.' })
  memberEmail: string;

  @IsNotEmpty({ message: '초대할 boardId를 입력해주세요.' })
  boardId: number;
}
