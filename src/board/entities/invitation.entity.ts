import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { InvitationDto } from '../dto/invitation.dto';

@Entity({
  name: 'verificationcode',
})
export class Invitation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', nullable: false })
  userId: number;

  @Column({ type: 'varchar', nullable: false })
  code: string;

  @Column({ type: 'datetime', nullable: false })
  expiry: Date;

  @Column({ type: 'int', nullable: false })
  boardId: number;
}
