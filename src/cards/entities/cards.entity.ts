import { Columns } from 'src/columns/entities/columns.entity';
import { User } from 'src/user/entities/user.entity';
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


@Entity('cards')
export class Cards {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', nullable: false })
  name: string;

  @Column({ type: 'varchar', nullable: true })
  description: string;

  @Column({ type: 'varchar', nullable: true })
  color: string;

  @Column({ type: 'varchar', nullable: true })
  deadline: Date;

  @Column({ type: 'simple-array', nullable: true })
  assignedUserId: number[];

  @Column({ type: 'float', nullable: true })
  orderNum: number; 

  @Column({ type: 'varchar', nullable: false })
  status: string;

  @Column({ type: 'bigint', nullable: true })
  createUserId: number;

  @OneToMany(() => Comments, (comment) => comment.card, { cascade: true })
  comments: Comments[];

  @ManyToOne(() => Columns, (column) => column.cards, { onDelete: "CASCADE" })
  @JoinColumn({ name: "column_id", referencedColumnName: "id" })
  column: Columns;

  @Column({type:"bigint",nullable:false})
  columnId:number;

  @ManyToOne(() => User, (user) => user.cards, { onDelete: 'CASCADE' }) 
  @JoinColumn()
  user: User;

  @ManyToOne(() => Columns, (column) => column.cards, { onDelete: 'CASCADE' })
  @JoinColumn()
  columns: Columns;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
