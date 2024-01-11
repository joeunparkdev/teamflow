import { IsString } from 'class-validator';

export class CreateFilesDto {
  @IsString()
  readonly name!: string;

  @IsString()
  readonly path!: string;
}
