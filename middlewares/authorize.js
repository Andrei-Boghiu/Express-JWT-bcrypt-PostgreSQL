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

        // check if the user is part of the team and if it has the same authority level as in headers
        const query = `SELECT * FROM user_teams WHERE user_id = $1 AND team_id = $2`
        const { rows: user_teams_rows } = await pool.query(query, [userDetails.id, teamId]);

        if (user_teams_rows.length === 0 || !user_teams_rows[0]?.approved) {
            // user from token isn't part of the team from req.headers.Team_Id
            // OR user is present but isn't approved in the team 
            return res.status(403).json({ message: 'Forbidden' });
        }

        // check if it has the same role as in headers
        const { rows: roles_rows } = await pool.query(`SELECT id, authority_level FROM roles WHERE id = $1`, [user_teams_rows[0].role_id])

        if (roles_rows.length === 0) {
            return res.status(500).json({ message: 'Server Error' });
        }

        if (roles_rows[0].authority_level != authorityLevel) {
            // authority level from headers doesn't match with the one from the database
            return res.status(403).json({ message: 'Forbidden' });
        }

        // authentication and authorization successful
        next();
    };
};

module.exports = authorize;
