const pool = require('../../config/db');

module.exports = getAllUsers = async (req, res) => {
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
