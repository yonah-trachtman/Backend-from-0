import { DataSource } from 'typeorm';
import { User } from './entities/user';
import { Group } from './entities/group';

const AppDataSource = new DataSource({
    type: 'sqlite',
    database: process.env.DATABASE,
    synchronize: true,
    entities: [User, Group],
});

export default AppDataSource;
