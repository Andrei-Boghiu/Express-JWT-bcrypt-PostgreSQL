const pool = require('../../config/db');

module.exports = userProfile = async (req, res) => {
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
