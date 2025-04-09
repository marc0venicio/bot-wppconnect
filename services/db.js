const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PWD || 'root',
    database: process.env.DB_NAME || 'bot_pesq',
});

const secondaryDB = mysql.createPool({
    host: process.env.SECONDARY_DB_HOST || 'localhost',
    user: process.env.SECONDARY_DB_USER || 'root',
    password: process.env.SECONDARY_DB_PWD || 'root',
    database: process.env.SECONDARY_DB_NAME || 'local_raw',
    port: process.env.SECONDARY_DB_PORT || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    connectTimeout: 10000 // 10 segundos
});


module.exports = { pool, secondaryDB };