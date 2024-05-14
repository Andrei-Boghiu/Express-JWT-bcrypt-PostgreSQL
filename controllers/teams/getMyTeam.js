const pool = require('../../config/db');

module.exports = getMyTeam = async (req, res) => {
    try {
        const teamId = req.body.teamId

        const query = `
            SELECT
                t.user_id as id, 
                u.email AS email,
                u.first_name AS first_name,
                u.last_name AS last_name,
                u.active AS active,
                u.last_login AS last_login,
                t.approved AS approved,
                u2.email as approver
                
            FROM user_teams AS t
            LEFT JOIN users AS u ON t.user_id = u.id
            LEFT JOIN users AS u2 ON t.approved_by = u2.id 
            WHERE t.team_id = $1;`;

        const { rows } = await pool.query(query, [teamId]);

        res.json({ members: rows?.length > 0 ? rows : [], });
    } catch (error) {
        console.error('Error fetching approved teams:', error);
        res.status(500).json({
            message: 'Server error fetching data.',
        });
    }
};