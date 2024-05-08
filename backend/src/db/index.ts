import pg from 'pg';
import dotenv from "dotenv";

const { Client } = pg;
dotenv.config();

const client = new Client(process.env.DATABASE_URL);

export default client;
