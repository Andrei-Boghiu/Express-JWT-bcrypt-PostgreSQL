const pool = require('../config/db');

const authorize = (authorityLevelRequired = 5) => {
    return async (req, res, next) => {
        const userDetails = req?.user;
        const teamId = req.headers?.team_id;
        const authorityLevel = req.headers.authority_level;

        // Check if all data is present
        if (!userDetails || !authorityLevel || !teamId || authorityLevel > authorityLevelRequired) {
            return res.status(403).json({ message: 'Forbidden' });
        }

        const query = `
        SELECT 
            ut.approved as user_is_approved_in_team,
            t.approved as team_is_approved,
            r.authority_level as authority_level
        FROM user_teams AS ut
        LEFT JOIN roles AS r ON ut.role_id = r.id
        LEFT JOIN teams AS t ON ut.team_id = t.id
        WHERE ut.user_id = $1 AND ut.team_id = $2`;

        const { rows } = await pool.query(query, [userDetails.id, teamId]);

        if (rows.length === 0 || !rows[0].team_is_approved || !rows[0].user_is_approved_in_team || authorityLevel != rows[0].authority_level) {
            // check if the user is part of the team (rows.length === 0)
            // & approved in the team (!rows[0].approved)
            // & has the same authority level as in headers (authorityLevel != rows[0].authority_level)
            return res.status(403).json({ message: 'Forbidden' });
        }

        // authentication and authorization successful
        next();
    };
};

module.exports = authorize;
