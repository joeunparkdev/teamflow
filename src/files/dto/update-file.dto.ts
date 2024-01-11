import { IsString } from 'class-validator';

export class UpdateFileDto {
  @IsString()
  readonly name!: string;

  @IsString()
  readonly path!: string;
}
