const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');

const registerUser = async (req, res) => {
    try {
        const { email, password, firstName, lastName } = req.body;

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Insert user into the database
        const query =
            'INSERT INTO users (email, first_name, last_name, hashed_password) VALUES ($1, $2, $3, $4) RETURNING id, email;';
        const values = [email, firstName, lastName, hashedPassword];
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
    const { email, password } = req.body;
    try {
        // Check if user exists
        const query = 'SELECT * FROM users WHERE email = $1;';
        const values = [email];
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

        const userDetails = { id: user.id, email: user.email, role: user.role, isAdmin: user.isadmin, firstName: user.first_name };

        // Generate JWT token
        const token = jwt.sign(userDetails, process.env.JWT_SECRET, { expiresIn: '16h' });

        res.json({
            message: 'Logged in successfully',
            token,
            user: userDetails,
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
        const userId = req.user.id;
        const query = 'SELECT id, email, first_name, last_name FROM users WHERE id = $1;';
        const { rows } = await pool.query(query, [userId]);
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

const verifyTokenEndpoint = (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Invalid token' });
        }

        const userDetails = { id: decoded.id, email: decoded.email, role: decoded.role, isAdmin: decoded.isAdmin, firstName: decoded.firstName };
        res.json({
            message: 'Token is valid',
            user: userDetails,
        });
    });
};

const getAllUsers = async (req, res) => {
    try {
        // const userId = req.user.id;
        // const publicColumns = 'id, email, first_name, last_name, role, team_id, isAdmin, isTeamAdmin, isManager, isAllocator, active, last_login, approved';
        const { rows } = await pool.query(`SELECT id, email, first_name, last_name, isadmin FROM users;`);

        if (rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(rows);
    } catch (error) {
        console.error('Error fetching all users:', error);
        res.status(500).json({
            message: 'Error fetching users',
        });
    }
};

module.exports = {
    registerUser,
    loginUser,
    verifyTokenEndpoint,
    getUserProfile,
    getAllUsers
};
