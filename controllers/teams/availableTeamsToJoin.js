const pool = require('../../config/db');

module.exports = availableTeamsToJoin = async (req, res) => {
    try {
        const userId = req.user.id;
        const query = `SELECT id, name, description FROM teams 
                        where approved = true
                        and not id in ( 
                            (select team_id from user_teams
                            where user_id = $1)
                        );`;
        const { rows } = await pool.query(query, [userId]);

        if (0 === rows.length) {
            return res.status(404).json({ message: 'No teams are available to join at this time.' });
        }

        res.json(rows);
    } catch (error) {
        console.error('Error fetching approved teams:', error);
        res.status(500).json({
            message: 'Server error fetching data.',
        });
    }
};