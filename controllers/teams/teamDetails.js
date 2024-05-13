const pool = require('../../config/db');

module.exports = teamDetails = async (req, res) => {
    try {
        const userId = req.user.id;
        const teamId = req.body.teamId;


        const query = `SELECT
                            u.id AS id,
                            u.email AS email,
                            u.first_name AS first_name,
                            u.last_name AS last_name,
                            r.id AS role_id,
                            r.name AS role_name,
                            t.approved AS approved
                        FROM user_teams AS t
                            LEFT JOIN users AS u ON t.user_id = u.id
                            LEFT JOIN roles AS r ON t.role_id = r.id
                        WHERE t.team_id = $1;`;
        await pool.query(query, [teamId]);

        res.json({ message: 'Access request send successfully.' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({
            message: `Server error...`,
            // error,
        });
    }
};
