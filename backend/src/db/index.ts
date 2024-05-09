import { Pool } from 'pg';
import dotenv from "dotenv";

dotenv.config();

const client = new Pool({
    user: 'postgres',
    password: 'password',
    host: 'localhost',
    port: 5432, // default Postgres port
    database: 'craby'
});

export default client;
