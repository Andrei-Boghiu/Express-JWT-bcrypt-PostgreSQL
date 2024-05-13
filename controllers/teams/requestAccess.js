const pool = require('../../config/db');

module.exports = requestAccess = async (req, res) => {
    try {
        const userId = req.user.id;
        const teamId = req.body.teamId

        let roleId;
        switch (Number(teamId)) {
            case 1959: // DEV team?
                roleId = 1971; // request role 'dev'
                break;
            case 1930: // admin team?
                roleId = 1969; // request role admin?
                break;
            case 1914: // team admins team?
                roleId = 1911; // request role team admin
                break;
            case 1775: // managers team?
                roleId = 1945 // request role manager
                break;
            // ? should I add a team for work allocators as well?
            default:
                roleId = 1809;
        }

        const query = `INSERT INTO user_teams (user_id, team_id, role_id) VALUES ($1, $2, $3)`;
        await pool.query(query, [userId, teamId, roleId]);

        res.json({ message: 'Access request send successfully.' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({
            message: `Server error...`,
            // error,
        });
    }
};
