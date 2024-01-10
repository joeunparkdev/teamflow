import { Columns } from '../../columns/entities/columns.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Factory } from 'nestjs-seeder';
import { User } from '../../user/entities/user.entity';
import { BoardUser } from '@/board-user/entities/boardUser.entity';

@Entity({
  name: 'boards',
})
export class Board {
  @PrimaryGeneratedColumn()
  id: number;

  @Factory((faker) => faker.lorem.words(2))
  @Column({ type: 'varchar', unique: true, nullable: false })
  name: string;

  @Factory((faker) => faker.internet.color())
  @Column({ type: 'varchar', nullable: false })
  backgroundColor: string;

  @Factory((faker) => faker.lorem.text())
  @Column({ type: 'text', nullable: false }) //mysql 타입은 text
  description: string; // typescript 에서는 string

  @Column({ type: 'int', nullable: false })
  creator: number;

  @OneToMany(() => Columns, (column) => column.board, { cascade: true })
  columns: Columns[];

  @OneToMany(() => BoardUser, (boardUser) => boardUser.board, { cascade: true })
  boardUsers: BoardUser[];

   // @ManyToMany(() => User, (users) => users.boards)
  // members: User[];

  @CreateDateColumn({ type: 'datetime', nullable: false })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime', nullable: false })
  updatedAt: Date;
}
