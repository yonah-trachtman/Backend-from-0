import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    name!: string;

    @Column()
    email!: string;

    @Column()
    status!: 'pending' | 'active' | 'blocked';

    @Column({ nullable: true })
    groupId?: number | null; 
}
