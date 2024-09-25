import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Group } from './group';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    email: string;

    @Column({ default: 'pending' })
    status: string;

    @ManyToOne(() => Group, group => group.users, { nullable: true })
    group: Group | null;
}
