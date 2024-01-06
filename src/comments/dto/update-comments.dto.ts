import { IsString } from "class-validator";

export class createcommentDto {
  @IsString()
  readonly comment!: string;
}