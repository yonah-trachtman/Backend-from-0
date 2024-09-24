import { createConnection } from 'typeorm';
import { User } from './models/user';

export const connectDatabase = async () => {
    return await createConnection({
        type: 'sqlite',
        database: 'database.sqlite',
        synchronize: true,
        entities: [User],
    });
};
