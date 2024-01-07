import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('email_verification')
export class EmailVerification {
  @PrimaryGeneratedColumn({ unsigned: true })
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  code: string;

  @Column()
  attempts: number;

  @Column()
  expiry: number;
}
