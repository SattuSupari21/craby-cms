import pg, { Pool } from 'pg';
import dotenv from "dotenv";

const { Client } = pg;
dotenv.config();

const client = new Pool({
    user: 'postgres',
    password: 'password',
    host: 'localhost',
    port: 5432, // default Postgres port
    database: 'craby'
});

// const client = new Client(process.env.DATABASE_URL);

export default client;
