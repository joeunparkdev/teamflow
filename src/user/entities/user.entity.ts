import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
} from 'class-validator';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Comments } from '../../cards/entities/comments.entity';
import { Cards } from '../../cards/entities/cards.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn({ unsigned: true })
  id: number;

  /**
   * 이메일
   * @example "example@example.com"
   */
  @OneToMany(() => Cards, (card) => card.user, { cascade: true })
  cards: Cards[];

  @OneToMany(() => Comments, (comment) => comment.user, { cascade: true })
  comments: Comments[];

  @IsNotEmpty({ message: '이메일을 입력해 주세요.' })
  @IsEmail({}, { message: '이메일 형식에 맞지 않습니다.' })
  @Column({ unique: true })
  email: string;

  /**
   * 비밀번호
   * @example "Ex@mp1e!!"
   */
  @IsNotEmpty({ message: '비밀번호을 입력해 주세요.' })
  @IsStrongPassword(
    {},
    {
      message:
        '비밀번호는 영문 알파벳 대,소문자, 숫자, 특수문자(!@#$%^&*)를 포함해서 8자리 이상으로 입력해야 합니다.',
    },
  )
  @Column({ select: false })
  password: string;

  /**
   * 닉네임
   * @example "홍길동"
   */
  @IsNotEmpty({ message: '이름을 입력해 주세요.' })
  @IsString()
  @Column()
  name: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
