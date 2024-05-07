const { Pool } = require('pg');

require('dotenv').config();

const pool = new Pool({
    user: process.env.PGUSER,
    host: process.env.PGHOST,
    database: process.env.PGDATABASE,
    password: process.env.PGPASSWORD,
    port: process.env.PGPORT,
});

// async function test() {
//     const time = await pool.query('SELECT NOW()')
//     console.log(`Database connection time: ${time.rows[0].now}`)

// }
// test()

module.exports = pool;
