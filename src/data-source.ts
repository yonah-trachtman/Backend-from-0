import { DataSource } from 'typeorm';
import { User } from './entities/user';
import { Group } from './entities/group';

export const AppDataSource = new DataSource({
    type: 'sqlite',
    database: 'database.sqlite',
    synchronize: true, // Set to false in production
    logging: true,
    entities: [User, Group], // Register entities here
});
