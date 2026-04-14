const mysql2 = require('mysql2/promise');
const dotenv = require('dotenv');
dotenv.config();

const db = mysql2.createPool({
    host: process.env.DB_HOST ?? 'localhost',
    user: process.env.DB_USERNAME ?? "root",
    password: process.env.DB_PASSWORD ?? "",
    database: process.env.DB_DATABASE ?? "dourado_lanches",
});

module.exports = db;