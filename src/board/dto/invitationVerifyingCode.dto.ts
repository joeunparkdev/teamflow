import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class InvitationVerifyingCodeDto {
  // @IsEmail()
  // readonly email: string;

  @IsString()
  readonly verificationCode: string;

  @IsNumber()
  readonly boardId: number;
}
