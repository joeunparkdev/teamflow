import { IsString } from 'class-validator';

export class UpdateCommentsDto {
  @IsString()
  readonly comment!: string;
}
