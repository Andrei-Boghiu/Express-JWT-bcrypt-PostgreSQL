const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../../config/db');
require('dotenv').config();

module.exports = loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        // Check if user exists
        const usersQuery = 'SELECT * FROM users WHERE email = $1;';
        const { rows: usersRows } = await pool.query(usersQuery, [email]);
        const usersTable = usersRows[0];

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
                        where u.user_id = $1`;
        const { rows: userTeamsRows } = await pool.query(joinTeamsRolesQuery, [usersTable.id]);

        pool.query(
            `UPDATE users
            SET last_login = CURRENT_TIMESTAMP
            WHERE id = $1`,
            [usersTable.id],
        );

        const userDetails = {
            id: usersTable.id,
            username: usersTable.username,
            email: usersTable.email,
            firstName: usersTable.first_name,
            teams: userTeamsRows?.length > 0 ? userTeamsRows : [],
        };

        // Generate JWT token
        const token = jwt.sign(userDetails, process.env.JWT_SECRET, { expiresIn: '16h' });

        res.json({
            message: 'Logged in successfully',
            token,
            ...userDetails,
        });
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({
            message: 'Server error.',
        });
    }
};
