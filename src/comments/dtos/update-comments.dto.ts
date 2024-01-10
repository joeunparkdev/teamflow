import { IsString } from 'class-validator';

export class UpdateCommentsDto {
  /**
   * 댓글
   * @example "댓글"
   */
  @IsString()
  readonly comment!: string;
}
