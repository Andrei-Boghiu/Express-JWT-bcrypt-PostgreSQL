const pool = require('../../config/db');
const calculateColumnAge = require('../../utils/queries');

module.exports = getMyTeams = async (req, res) => {
    try {
        const userId = req.user.id;

        if (!userId) {
            res.status(400).json({
                message: 'Bad Request'
            })
        }

        const teamCreationDateAge = calculateColumnAge('created_at', 'Created');

        const queryMemberships = `
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

        const queryTeams = `
        SELECT 
        id,
        name,
        description,
        created_by,
        owned_by,
        approved,
        approved_by,
        ${teamCreationDateAge} 
        
        FROM teams 
        WHERE id NOT IN (SELECT team_id FROM user_teams) 
        AND owned_by = $1`

        const { rows: memberships } = await pool.query(queryMemberships, [userId]);

        const { rows: teams } = await pool.query(queryTeams, [userId])

        res.json({ memberships, teams });
    } catch (error) {
        console.error('Error fetching approved teams:', error);
        res.status(500).json({
            message: 'Server error fetching data.',
        });
    }
};
