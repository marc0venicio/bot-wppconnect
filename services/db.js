const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PWD || 'root',
    database: process.env.DB_NAME || 'bot_pesq',
    // debug: process.env.DEBUG === '1',

});

const secondaryDB = mysql.createPool({
    host: process.env.SECONDARY_DB_HOST || 'localhost',
    user: process.env.SECONDARY_DB_USER || 'root',
    password: process.env.SECONDARY_DB_PWD || 'root',
    database: process.env.SECONDARY_DB_NAME || 'raw',
    port: process.env.SECONDARY_DB_PORT || 3388,
});


module.exports = { pool, secondaryDB };