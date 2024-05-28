const pool = require('../../../config/db');

module.exports = assignWorkItem = async (req, res) => {
    try {
        console.log("assignWorkItem")
        const userId = req.user.id;
        const teamId = req.headers?.team_id;

        if (!userId || !teamId) {
            return res.status(400).json({ message: 'Invalid request' });
        }

        const client = await pool.connect();
        try {
            await client.query('BEGIN');

            const updateResult = await client.query(
                `
                UPDATE work_items
                SET assignee_id = $1, status = 'Work in Progress', last_assigned_at = CURRENT_TIMESTAMP WITH TIMEZONE
                WHERE id = (
                    SELECT id FROM work_items
                    WHERE status IN ('Unassigned', 'Reopened') AND team_id = $2 AND assignee_id IS NULL
                    ORDER BY priority ASC, due_date ASC
                    LIMIT 1
                )
                RETURNING *;
                `,
                [userId, teamId],
            );

            if (updateResult.rows.length === 0) {
                res.status(404).send('No pending work items available.');
                await client.query('COMMIT');
                return
            }
            await client.query('COMMIT');

            const { rows } = await pool.query(
                `SELECT * FROM work_items 
                WHERE assignee_id = $1 AND team_id = $2
                    AND status NOT IN ('Resolved', 'Removed')`,
                [userId, teamId],
            );

            res.json(rows);

        } catch (error) {
            console.log('Transaction failed:', error);
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
