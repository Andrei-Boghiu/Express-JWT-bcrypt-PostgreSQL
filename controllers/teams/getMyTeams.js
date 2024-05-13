const pool = require('../../config/db');

module.exports = getMyTeams = async (req, res) => {
    try {
        const userId = req.user.id;

        const query = `
                SELECT 
                    t.id as id,
                    t.name as name,
                    t.description as description,
                    ut.approved as approved,
                    u1.email as approver,
                    u2.email as team_owner,
                    r.name as your_role
                FROM user_teams AS ut
                LEFT JOIN teams AS t ON ut.team_id = t.id
                LEFT JOIN roles AS r ON ut.role_id = r.id
                LEFT JOIN users AS u1 ON ut.approved_by = u1.id
                LEFT JOIN users AS u2 ON t.owned_by = u2.id

                WHERE ut.user_id = $1;`;

        const { rows } = await pool.query(query, [userId]);

        res.json({ teams: rows?.length > 0 ? rows : [], });
    } catch (error) {
        console.error('Error fetching approved teams:', error);
        res.status(500).json({
            message: 'Server error fetching data.',
        });
    }
};