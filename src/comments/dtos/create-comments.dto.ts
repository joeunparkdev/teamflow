import { IsString } from 'class-validator';

export class CreateCommentDto {
    /**
   * 댓글
   * @example "댓글"
   */
  @IsString()
  comment: string;
}
