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

  @OneToMany(() => Columns, (column) => column.board)
  columns: Columns[];

  @ManyToOne(() => User, (user) => user.boards)
  creator: User;

  // @ManyToMany(() => User, (users) => users.boards)
  // members: User[];

  @CreateDateColumn({ type: 'datetime', nullable: false })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime', nullable: false })
  updatedAt: Date;
}
