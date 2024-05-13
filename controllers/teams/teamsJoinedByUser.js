const pool = require('../../config/db');

module.exports = teamsJoinedByUser = async (req, res) => {
    try {
        const userId = req.user.id;

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
        const { rows } = await pool.query(joinTeamsRolesQuery, [userId]);

        res.json({ teams: rows?.length > 0 ? rows : [], });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({
            message: `Server error...`,
            // error,
        });
    }
};