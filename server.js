const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

const bodyParser = require('body-parser');
const cors = require('cors');
const corsOptions = require('./config/corsOptions');

const userRoutes = require('./routes/users');

const pool = require('./config/db');

app.use(cors(corsOptions));

app.use(bodyParser.json());
app.use('/api/users', userRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

async function testDatabaseConnection() {
    try {
        // Connect to the PostgreSQL server
        const client = await pool.connect();
        console.log('Connected to the database successfully.');

        // Perform a simple query
        const { rows } = await client.query('SELECT NOW() as now');
        console.log('Current time from database:', rows[0].now);

        // Release the client back to the pool
        client.release();

        // Optional: Close the pool if no more clients are needed
        await pool.end();
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}

testDatabaseConnection();
