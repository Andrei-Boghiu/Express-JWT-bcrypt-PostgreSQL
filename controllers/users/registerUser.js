const bcrypt = require('bcryptjs');
const pool = require('../../config/db');

module.exports = registerUser = async (req, res) => {
    try {
        const { email, password, firstName, lastName } = req.body;

        if (!email || !password || !firstName || !lastName) {
            req.status(400).json({
                message: 'Some of the required fields are missing.',
            });
            return;
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const username = email.split('@')[0]; // assuming all users will have emails from the same organization

        const query =
            'INSERT INTO users (email, username, first_name, last_name, hashed_password) VALUES ($1, $2, $3, $4, $5) RETURNING username;';
        const values = [email, username, firstName, lastName, hashedPassword];
        const { rows } = await pool.query(query, values);

        res.status(201).json({
            message: `User ${rows[0].username}@ registered successfully`,
            user: rows[0],
        });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({
            message: 'Error registering new user',
            error,
        });
    }
};
