import { Factory } from 'nestjs-seeder';
import { Columns } from '../../columns/entities/columns.entity';
import { User } from '../../user/entities/user.entity';
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
import { Comments } from '../../comments/entities/comments.entity';
import { Files } from '@/files/entities/file.entity';

@Entity('cards')
export class Cards {
  @PrimaryGeneratedColumn()
  id: number;

  @Factory((faker) => faker.lorem.words(1))
  @Column({ type: 'varchar', nullable: false })
  name: string;

  @Factory((faker) => faker.lorem.text())
  @Column({ type: 'varchar', nullable: true })
  description: string;

  @Factory((faker) => faker.internet.color())
  @Column({ type: 'varchar', nullable: true })
  color: string;

  @Factory((faker) => faker.date.future())
  @Column({ type: 'varchar', nullable: true })
  deadline: Date;

  @Factory((faker) => faker.helpers.rangeToNumber({ min: 1, max: 10 }))
  @Column({ nullable: true })
  assignedUserId: number;

  @Factory((faker) => faker.number.float())
  @Column({ type: 'float', nullable: true })
  orderNum: number;

  @Factory((faker) => faker.number.bigInt())
  @Column({ type: 'bigint', nullable: true })
  createUserId: number;

  @OneToMany(() => Comments, (comment) => comment.card)
  @JoinColumn()
  comments: Comments[];

  @OneToMany(() => Files, (files) => files.card)
  @JoinColumn()
  files: Files[];

  @ManyToOne(() => Columns, (column) => column.cards, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'column_id', referencedColumnName: 'id' })
  column: Columns;

  @Factory((faker) => faker.number.bigInt())
  @Column({ type: 'bigint', nullable: false })
  columnId: number;

  @ManyToOne(() => User, (user) => user.cards, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
