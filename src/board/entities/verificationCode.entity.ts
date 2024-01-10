import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { InvitationDto } from '../dto/invitation.dto';

@Entity({
  name: 'verificationcode',
})
export class VerificationCode {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', nullable: false })
  email: string;

  @Column({ type: 'varchar', nullable: false })
  code: string;

  @Column({ type: 'datetime', nullable: false }) 
  expiry: Date;
}
