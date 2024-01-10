import { BoardUser } from 'src/board-user/entities/boardUser.entity';
import { Columns } from 'src/columns/entities/columns.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({
  name: 'boards',
})
export class Board {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', unique: true, nullable: false })
  name: string;

  @Column({ type: 'varchar', nullable: false })
  backgroundColor: string;

  @Column({ type: 'text', nullable: false }) //mysql 타입은 text
  description: string; // typescript 에서는 string

  @Column({ type: 'int', nullable: false })
  creator: number;

  @OneToMany(() => Columns, (column) => column.board, { cascade: true })
  columns: Columns[];

  @OneToMany(() => BoardUser, (boardUser) => boardUser.board, { cascade: true })
  boardUsers: BoardUser[];

  @CreateDateColumn({ type: 'datetime', nullable: false })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime', nullable: false })
  updatedAt: Date;
}
