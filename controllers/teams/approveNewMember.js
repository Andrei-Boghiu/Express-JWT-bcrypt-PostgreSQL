const pool = require('../../config/db');

module.exports = approveNewMember = async (req, res) => {
    try {
        const approverId = req.user.id;
        const teamId = req.headers?.team_id;
        const newMemberId = req.body.newUserId;
        console.log({ approverId, teamId, newMemberId })

        const query = `
        UPDATE user_teams 
        SET approved = true, approved_by = $1, approved_at = CURRENT_TIMESTAMP
        WHERE user_id = $2 AND team_id = $3`;

        await pool.query(query, [approverId, newMemberId, teamId]);

        const checkQuery = `
                select 
                    u.email as email,
                    ut.approved as approved
                from user_teams AS ut
                JOIN users AS u ON u.id = ut.user_id
                where ut.user_id = $1 and ut.team_id = $2`
        const { rows } = await pool.query(checkQuery, [newMemberId, teamId]);
        const userData = rows[0];

        const message = `User ${userData.email} approved successfully`;

        res.json({ message });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({
            message: 'Server error fetching data.',
        });
    }
};