const Pool = require('pg').Pool

const pool = new Pool({
    user: 'postgres',
    // password: process.env.POSTGRES_SUPER_PASS,
    host: 'localhost',
    port: 5432,
    database: 'taskmaster'
})

module.exports = pool;
