const pool = require('../../../config/db');
module.exports = removeWorkItems = async (req, res) => {
    try {
        const workItems = req.body;
        const teamId = req.headers?.team_id;

        if (workItems?.length === 0 || !teamId) {
            return res.status(400).json({ message: 'Invalid request' });
        }

        const hasRequiredHeaders = workItems.every(item => Object.keys(item).includes("aux_id"));

        if (!hasRequiredHeaders) {
            return res.status(400).json({ message: 'Invalid data headers' });
        }

        const client = await pool.connect();
        const failedItems = [];

        try {
            await client.query('BEGIN');

            for (const item of workItems) {
                const { aux_id } = item;

                const deleteQuery = `DELETE FROM work_items WHERE team_id = ${teamId} AND aux_id = '${aux_id}'`;
                const deleteResult = await client.query(deleteQuery);

                if (deleteResult.rowCount === 0) {
                    failedItems.push({ aux_id, error: 'Work item not found' });
                }
            }

            if (failedItems.length === 0) {
                await client.query('COMMIT');
                return res.status(200).json({ message: `Work item${workItems?.length === 1 ? '' : 's'} removed successfully.` });
            } else {
                await client.query('ROLLBACK');
                return res.status(206).json({ message: 'Some work items failed to remove.', failedItems });
            }
        } catch (error) {
            await client.query('ROLLBACK');
            console.log(error);
            return res.status(500).json({ message: 'Failed to remove work items.', error });
        } finally {
            client.release();
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Failed to remove work items.' });
    }
};