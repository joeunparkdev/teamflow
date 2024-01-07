import { IsRgbColor } from 'class-validator';
import { User } from 'src/user/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn} from 'typeorm';

@Entity()
export class Cards {
    @PrimaryGeneratedColumn()
    id: number;  

    @Column({ type:"varchar",nullable :false})
    name: string;

    @Column({ type:"varchar",nullable: true })
    description: string;

    @Column({ type:"varchar",nullable: true })
    color: string;

    @Column({ type:"varchar",nullable: true })
    deadline: Date;

    @Column({ type:"simple-array",nullable: true })
    assignedUserId:number[];

    @Column({ type:"bigint",nullable: true })
    orderNum:number;

    @Column({ type:"varchar",nullable: false })
    status:string;

    @Column({ type:"bigint",nullable: true })
    createUserId:number;

    /*
    @ManyToOne(() => Column, (column) => column.cards,{onDelete:"CASCADE",})
    column: Column;
*/
/*
    @ManyToOne(()=> User,(user)=> user.cards,{onDelete:"CASCADE",})
    @JoinColumn({name:"user_id"})
    user:User;
    */

    @CreateDateColumn()
    createdAt: Date;
  
    @UpdateDateColumn()
    updatedAt: Date;
}

