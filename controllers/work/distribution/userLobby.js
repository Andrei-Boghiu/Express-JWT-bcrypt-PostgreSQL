const pool = require('../../../config/db');

module.exports = lobby = async (req, res) => {
    console.log("lobby");

    const userId = req.user.id;
    const teamId = req.headers?.team_id;

    if (!userId || !teamId) {
        return res.status(400).json({ message: 'Invalid request' });
    }

    try {
        const { rows } = await pool.query(
            `SELECT 
            id,
            aux_id,
            aux_tool,
            aux_status,
            status,
            resolution,
            priority,
            due_date AS "Due Date", 
            follow_up_date AS "Follow Up", 
            annotation
        FROM work_items 
        WHERE assignee_id = $1 AND team_id = $2
            AND status NOT IN ('Resolved', 'Removed')`,
            [userId, teamId],
        );
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
};