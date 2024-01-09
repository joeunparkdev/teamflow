import { Exclude } from 'class-transformer';
import {
  IsDate,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
} from 'class-validator';
import { ColumnStatus } from 'src/enums/columns-status.enum';
import { UserStatus } from 'src/enums/user-status.enum';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Comments } from '../../comments/entities/comments.entity';
import { Cards } from '../../cards/entities/cards.entity';
import { UserRole } from '../types/user-role.type';
import { BoardUser } from 'src/board-user/entities/boardUser.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToMany(() => Cards, (card) => card.user)
  cards: Cards[];

  @OneToMany(() => Comments, (comment) => comment.user)
  comments: Comments[];

  @OneToMany(() => BoardUser, (boardUser) => boardUser.user)
  boardUsers: BoardUser[];
  /**
   * 이메일
   * @example "example@example.com"
   */
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

  /**
   * 휴대폰 번호
   * @example "010-000-0000"
   */
  @IsString()
  @Column({ nullable: true })
  phone: string;

  /**
   * 생년월일
   * @example "7001010"
   */
  @IsDate()
  @Column({ nullable: true })
  birthdate: Date;

  /**
   * 역할
   * @example "Collaborator"
   */

  @IsEnum(UserRole)
  @Column({ type: 'enum', enum: UserRole, default: UserRole.User })
  role: UserRole;

  /**
   * 상태
   * @example "Active"
   */
  @IsEnum(UserStatus)
  @Column({ default: 'Active' })
  status: UserStatus;

  @Column({ nullable: true })
  refreshToken: string;

  @Column({ nullable: true })
  kakaoId: string;

  @Column({ nullable: true })
  googleId: string;

  @Column({ nullable: true })
  appleId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
