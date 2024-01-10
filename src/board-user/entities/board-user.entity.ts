import { Board } from '../../board/entities/board.entity';
import { User } from '../../user/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Factory } from 'nestjs-seeder';

@Entity()
export class BoardUser {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  boardId: number;

  @Column()
  userId: number;

  @ManyToOne(() => Board, (board) => board.boardUsers, { onDelete: 'CASCADE' })
  @JoinColumn()
  board: Board;
  
  @ManyToOne(() => User, (user) => user.boardUsers, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: User;
  
}
