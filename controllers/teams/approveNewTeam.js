const pool = require('../../config/db');

module.exports = approveNewTeam = async (req, res) => {
    try {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');

            const approverId = req.user.id;
            const teamId = req.body.teamId;

            const approveTeamQuery = `
                    UPDATE teams
                    SET approved = true, approved_by = $1
                    WHERE id = $2`;
            await client.query(approveTeamQuery, [approverId, teamId]);

            const setTeamAdminQuery = `
                    INSERT INTO user_teams (user_id, team_id, role_id, approved, approved_by, approved_at)
                    VALUES (
                            (SELECT owned_by FROM teams WHERE id = $1),
                            $1,
                            1911,
                            true,
                            $2,
                            CURRENT_TIMESTAMP
                            )`;

            await client.query(setTeamAdminQuery, [teamId, approverId]);

            await client.query('COMMIT');
            res.json({ message: `Team approved and requester set as Team Admin` });
        } catch (error) {
            console.log('Transaction failed for approving team:', error);
            await client.query('ROLLBACK');
            res.status(500).send('Failed to assign work item.');
        } finally {
            client.release();
        }
    } catch (error) {
        console.log('Failed to connect to the database:', error);
        res.status(500).send('Database connection failed.');
    }
};
