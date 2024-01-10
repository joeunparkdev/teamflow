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
import { Comments } from './comments.entity';
import { Files } from '../../files/entities/file.entity';

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
  assignedUserId: string[];

  @Column({ type: 'bigint', nullable: true })
  orderNum: number;

  @Column({ type: 'varchar', nullable: false })
  status: string;

  @Column({ type: 'bigint', nullable: true })
  createUserId: number;

  @OneToMany(() => Comments, (comment) => comment.card, { cascade: true })
  comments: Comments[];

  @OneToMany(() => Files, (file) => file.card, { cascade: true })
  files: Files[];

  @ManyToOne(() => User, (user) => user.cards, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
