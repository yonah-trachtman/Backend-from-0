import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { User } from './user';

@Entity()
export class Group {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    status: string;

    @OneToMany(() => User, user => user.group)
    users: User[];
}
