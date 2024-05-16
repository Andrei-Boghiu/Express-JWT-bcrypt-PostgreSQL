const pool = require('../../config/db');

module.exports = teamsJoinedByUser = async (req, res) => {
    try {
        const userId = req.user.id;

        const joinTeamsRolesQuery = `
                SELECT 
                    concat(u.user_id, u.team_id) as id,
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
                    t.owned_by as team_owned_by_id,
                    us2.email as team_owned_by,
                    r.id as role_id,
                    r.name as role_name,
                    r.authority_level as role_authority,
                    us.email as email,
                    us.first_name as first_name,
                    us.last_name as last_name
                    
                FROM user_teams AS u
                JOIN teams AS t ON u.team_id = t.id 
                JOIN roles AS r ON u.role_id = r.id
                JOIN users AS us ON us.id = u.user_id
                JOIN users as us2 ON us2.id = t.owned_by
                WHERE u.user_id = $1`;
        const { rows } = await pool.query(joinTeamsRolesQuery, [userId]);

        res.json(rows);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({
            message: `Server error...`,
            // error,
        });
    }
};
