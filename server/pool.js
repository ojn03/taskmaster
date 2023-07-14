require('dotenv').config()
const Pool = require('pg').Pool
const connectionString = process.env.POSTGRES_CONNECTION_URI 
const pool = new Pool({
    connectionString
})

module.exports = pool;
