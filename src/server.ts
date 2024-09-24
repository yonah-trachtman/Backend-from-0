import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { connectDatabase } from './database';
import userRoutes from './routes/userRoutes';

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use('/api/users', userRoutes);

const startServer = async () => {
    await connectDatabase();
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
};

startServer().catch(console.error);
