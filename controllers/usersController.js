const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');

const registerUser = async (req, res) => {
    try {
        const { email, password, firstName, lastName } = req.body;

        if (!email || !password || !firstName || !lastName) {
            req.status(400).json({
                message: 'Some of the required fields are missing.',
            });
            return
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
            message: 'Error registering new user', error
        });
    }
};

const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        // Check if user exists
        const usersQuery = 'SELECT * FROM users WHERE email = $1;';
        const { rows: usersTows } = await pool.query(usersQuery, [email]);
        const usersTable = usersTows[0];

        if (!usersTable) {
            return res.status(404).json({ message: 'Invalid credentials' });
        }

        // Validate password
        const validPassword = await bcrypt.compare(password, usersTable.hashed_password);
        if (!validPassword) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const joinTeamsRolesQuery = `select 
                            u.user_id,
                            u.team_id,
                            u.role_id,
                            u.approved,
                            u.approved_by,
                            u.approved_at,
                            u.joined_at,
                            t.name as team_name,
                            t.description as team_description,
                            t.created_by as team_created_by,
                            t.owned_by as team_owned_by,
                            r.id as role_id,
                            r.name as role_name,
                            r.authority_level as role_authority
                            
                        from user_teams as u
                        join teams as t on u.team_id = t.id 
                        join roles as r on u.role_id = r.id
                        where u.user_id = $1`
        const { rows: userTeamsRows } = await pool.query(joinTeamsRolesQuery, [usersTable.id])

        const userDetails = {
            id: usersTable.id,
            username: usersTable.username,
            email: usersTable.email,
            firstName: usersTable.first_name,
            teams: userTeamsRows?.length > 0 ? userTeamsRows : []
        };

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
            message: 'Server error.',
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

        res.json({
            message: 'Token is valid',
            user: decoded,
        });
    });
};

const getAllUsers = async (req, res) => {
    try {
        // const userId = req.user.id;
        // const publicColumns = 'id, email, first_name, last_name, role, team_id, isAdmin, isTeamAdmin, isManager, isAllocator, active, last_login, approved';
        const { rows } = await pool.query(`SELECT id, email, first_name, last_name FROM users;`);

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
