import express from 'express';
import AppDataSource from './database';
import userRoutes from './routes/userRoutes';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json());

AppDataSource.initialize()
    .then(() => {
        console.log('Database connection established.');

        app.use('/users', userRoutes);

        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    })
    .catch(error => console.error('Error during Data Source initialization:', error));
