import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class InvitationDto {
  @IsEmail()
  @IsNotEmpty({ message: '초대할 사람의 이메일을 작성해주세요.' })
  memberEmail: string;
}
