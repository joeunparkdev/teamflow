import { Board } from 'src/board/entities/board.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class BoardUser {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  boardId: number;

  @Column()
  userId: number;

  @ManyToOne(() => Board, (board) => board.boardUsers, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'boardId' })
  board: Board;

  @ManyToOne(() => User, (user) => user.boardUsers, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;
}
