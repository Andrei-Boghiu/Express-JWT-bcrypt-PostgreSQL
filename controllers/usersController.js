const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/db'); // Make sure this path is correct

const registerUser = async (req, res) => {
    const { username, password } = req.body;
    try {
        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Insert user into the database
        const query =
            'INSERT INTO users (username, hashed_password) VALUES ($1, $2) RETURNING id, username;';
        const values = [username, hashedPassword];
        const { rows } = await pool.query(query, values);

        // Return the new user
        res.status(201).json({
            message: 'User registered successfully',
            user: rows[0],
        });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({
            message: 'Error registering new user',
        });
    }
};

const loginUser = async (req, res) => {
    const { username, password } = req.body;
    try {
        // Check if user exists
        const query = 'SELECT * FROM users WHERE username = $1;';
        const values = [username];
        const { rows } = await pool.query(query, values);
        const user = rows[0];

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Validate password
        const validPassword = await bcrypt.compare(password, user.hashed_password);
        if (!validPassword) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Generate JWT token
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({
            message: 'Logged in successfully',
            token,
            user: { id: user.id, username: user.username },
        });
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({
            message: 'Error logging in user',
        });
    }
};

const getUserProfile = async (req, res) => {
    try {
        const userId = req.user.id; // Assuming userID is stored in req.user by the auth middleware
        const query = 'SELECT id, username FROM users WHERE id = $1;';
        const values = [userId];
        const { rows } = await pool.query(query, values);
        const user = rows[0];

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(user);
    } catch (error) {
        console.error('Error fetching user profile:', error);
        res.status(500).json({
            message: 'Error fetching user profile',
        });
    }
};

module.exports = {
    registerUser,
    loginUser,
    getUserProfile,
};
