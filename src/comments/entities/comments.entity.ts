import {
  Column,
  CreateDateColumn,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';

export class Comments {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.comment, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  // @ManyToOne(() => Card, (card) => card.comment, { onDelete: 'CASCADE' })
  @Column()
  comment: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
