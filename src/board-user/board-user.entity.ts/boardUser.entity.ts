import { Column, PrimaryGeneratedColumn } from 'typeorm';

export class BoardUser {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', nullable: false })
  userId: number;

  @Column({ type: 'int', nullable: false })
  boardId: number;
}
