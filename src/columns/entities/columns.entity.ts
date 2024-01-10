import { Exclude } from 'class-transformer';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsStrongPassword,
} from 'class-validator';
import { LexoRank } from 'lexorank';
import { Factory } from 'nestjs-seeder';
import { Board } from '../../board/entities/board.entity';
import { Cards } from '../../cards/entities/cards.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserRole } from '../../user/types/user-role.type';

@Entity('columns')
export class Columns {
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * 컬럼 이름
   * @example "할 일"
   */
  @Factory((faker) => faker.lorem.words(2))
  @IsNotEmpty({ message: '컬럼 이름을 입력해 주세요.' })
  @Column({ unique: true })
  name: string;

  /**
   * 컬럼 순서
   * @example "0"
   */
  @Factory((faker) => faker.number.int())
  @IsNotEmpty({ message: '컬럼 순서를 입력해 주세요.' })
  @IsNumber(
    {},
    {
      message: '컬럼 순서는 숫자로만 입력 가능합니다.',
    },
  )
  @Factory((faker) => faker.number.int())
  @Column({ unique: true })
  position: string;

  /**
   * 보드 아이디
   * @example "9"
   */
  @Factory((faker) => faker.number.int())
  @IsNotEmpty({ message: '보드 아이디를 입력해 주세요.' })
  @IsNumber()
  @Column()
  boardId: number;

  @ManyToOne(() => Board, (board) => board.columns, { onDelete: 'CASCADE' })
  @JoinColumn()
  board: Board;

  @OneToMany(() => Cards, (card) => card.columns, { cascade: true })
  @JoinColumn()
  cards: Cards[];

  @Factory((faker) => faker.number.int())
  @Column({ nullable: false })
  createdUserId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
