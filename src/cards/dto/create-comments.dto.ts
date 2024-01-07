import { IsString } from "class-validator";


export class createCommentDto {
  @IsString()
  readonly comment: string;
}