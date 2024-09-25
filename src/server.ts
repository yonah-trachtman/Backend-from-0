// src/server.ts
import express from 'express';
import userRoutes from './routes/userRoutes';
import { connectToDatabase } from './database';

const app = express();
const port = 3001; // You can change this port if needed

app.use(express.json());
app.use('/users', userRoutes); // Set up user routes

// Start the server
app.listen(port, () => {
  connectToDatabase();
  console.log(`Server running at http://localhost:${port}`);
});
