const pool = require('../../config/db');

module.exports = approveNewMember = async (req, res) => {
    try {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');

            const approverId = req.user.id;
            const teamId = req.body.teamId || req.headers?.team_id;
            const newMemberId = req.body.newUserId;
            console.log({ approverId, teamId, newMemberId });
            // ! Check Here if the approval for normal teams works as well as it does for special teams
            const query = `
        UPDATE user_teams 
        SET approved = true, approved_by = $1, approved_at = CURRENT_TIMESTAMP
        WHERE user_id = $2 AND team_id = $3`;

            await client.query(query, [approverId, newMemberId, teamId]);

            const checkQuery = `
                SELECT 
                    u.email as email,
                    ut.approved as approved
                FROM user_teams AS ut
                JOIN users AS u ON u.id = ut.user_id
                WHERE ut.user_id = $1 and ut.team_id = $2`;
            const { rows } = await client.query(checkQuery, [newMemberId, teamId]);
            const userData = rows[0];

            const message = `User ${userData.email} approved successfully`;

            await client.query('COMMIT');

            res.json({ message });
        } catch (error) {
            console.log('Approving member database transaction failed!:', error);
            await client.query('ROLLBACK');
            res.status(500).send('Approving member database transaction failed!');
        } finally {
            client.release();
        }
    } catch (error) {
        console.log('Database connection failed:', error);
        res.status(500).send('Database connection failed.');
    }
};
