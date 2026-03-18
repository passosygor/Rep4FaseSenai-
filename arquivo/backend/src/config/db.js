import mysql2 from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const db = mysql2.createPool({
    host: process.env.DB_LOCALHOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD ?? 'ygor26',
    database: process.env.DB_DATABASE || 'dourado_lanches',
});

export default db;