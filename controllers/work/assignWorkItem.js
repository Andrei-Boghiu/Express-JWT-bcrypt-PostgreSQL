const pool = require('../../config/db');

module.exports = assignWorkItem = async (req, res) => {
    try {
        const userId = req.user.id;
        const client = await pool.connect();

        try {
            await client.query('BEGIN');

            const updateResult = await client.query(
                `
                UPDATE work_items
                SET assigned_to = $1, status = 'WIP'
                WHERE id = (
                    SELECT id FROM work_items
                    WHERE status = 'Unassigned' 
                    ORDER BY priority ASC, due_date ASC
                    LIMIT 1
                )
                RETURNING *;
                `,
                [userId],
            );

            if (updateResult.rows.length === 0) {
                res.status(404).send('No pending work items available.');
                return;
            }

            const { rows } = await client.query(
                "SELECT * FROM work_items WHERE assigned_to = $1 AND status = 'WIP'",
                [userId],
            );

            res.json(rows);

            await client.query('COMMIT');
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
