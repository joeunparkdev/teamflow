import { Exclude } from 'class-transformer';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsStrongPassword,
} from 'class-validator';
import { ColumnStatus } from 'src/enums/columns-status.enum';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserRole } from '../../user/types/user-role.type';
import { Cards } from 'src/cards/entities/cards.entity';

@Entity('columns')
export class Columns {
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * 컬럼 이름
   * @example "할 일"
   */
  @IsNotEmpty({ message: '컬럼 이름을 입력해 주세요.' })
  @Column({ unique: true })
  name: string;

  /**
   * 컬럼 순서
   * @example "0"
   */
  @IsNotEmpty({ message: '컬럼 순서를 입력해 주세요.' })
  @IsNumber(
    {},
    {
      message: '컬럼 순서는 숫자로만 입력 가능합니다.',
    },
  )
  @Column({ unique: true })
  orderNum: number;

  /**
   * 보드 아이디
   * @example "9"
   */
  @IsNotEmpty({ message: '보드 아이디를 입력해 주세요.' })
  @IsNumber()
  @Column()
  boardId: number;

  /**
   * 상태
   * @example "Todo"
   */
  @IsNotEmpty({ message: '보드 상태를 입력해 주세요.' })
  @IsEnum(ColumnStatus)
  @Column({ type: 'enum', enum: ColumnStatus, default: ColumnStatus.Todo })
  status: ColumnStatus;

  
  @OneToMany(()=>Cards,(card)=>card.column)
  card:Cards[];

  @Column({ nullable: false })
  createdUserId: number;

    

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
