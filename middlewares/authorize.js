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
            t.approved as approved,  
            r.authority_level as authority_level
        FROM user_teams AS t
        LEFT JOIN roles AS r on t.role_id = r.id
        WHERE t.user_id = $1 AND t.team_id = $2`;

        const { rows } = await pool.query(query, [userDetails.id, teamId]);

        if (rows.length === 0 || !rows[0].approved || authorityLevel != rows[0].authority_level) {
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
