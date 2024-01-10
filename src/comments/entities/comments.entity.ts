import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Cards } from '../../cards/entities/cards.entity';
import { Factory } from 'nestjs-seeder';

@Entity('comments')
export class Comments {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.comments, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: User;

  @ManyToOne(() => Cards, (card) => card.comments, { onDelete: 'CASCADE' })
  @JoinColumn()
  card: Cards;

  @Factory((faker) => faker.helpers.rangeToNumber({ min: 1, max: 10 }))
  @Column()
  userId: number;

  @Factory((faker) => faker.helpers.rangeToNumber({ min: 1, max: 10 }))
  @Column()
  cardId: number;

  @Factory((faker) => faker.lorem.text())
  @Column()
  comment: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
