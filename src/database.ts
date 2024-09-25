
import { Client } from 'pg';
import dotenv from 'dotenv';


dotenv.config();

const client = new Client({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT),
});

const connectToDatabase = async () => {
  try {
    await client.connect();
    console.log('Connected to PostgreSQL database successfully!');
  } catch (err) {
    console.error('Connection to PostgreSQL database failed!', err);
  }
};

export { client, connectToDatabase };
