const pool = require('../../config/db');
const calculateColumnAge = require('../../utils/queries');

module.exports = getAdminMembers = async (req, res) => {
    try {
        const lastLoginAge = calculateColumnAge('u.last_login', 'Last Login');

        const query = `
            SELECT
                concat(t.user_id, t.team_id) as id,
                t.user_id AS uid,
                t.team_id AS tid,
                u.email AS "User Email",
                u.first_name AS "First Name",
                u.last_name AS "Last Name",
                ts.name as "Team",
                r.name AS "Role",
                u.active AS "Active",
                ${lastLoginAge},
                t.approved AS approved,
                u2.email as approver

            FROM user_teams AS t
            LEFT JOIN users AS u ON t.user_id = u.id
            LEFT JOIN users AS u2 ON t.approved_by = u2.id 
            LEFT JOIN teams AS ts ON t.team_id = ts.id
            LEFT JOIN roles AS r ON t.role_id = r.id
            WHERE t.team_id = 1914 OR t.team_id = 1930;`;

        const { rows } = await pool.query(query);

        res.json(rows);
    } catch (error) {
        console.error('Error fetching approved teams:', error);
        res.status(500).json({
            message: 'Server error fetching data.',
        });
    }
};
