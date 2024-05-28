const pool = require('../../../config/db');
const { forbiddenHeaders, uploadRequiredHeaders } = require("../config");

module.exports = addNewWorkItems = async (req, res) => {
    try {
        console.log(`addNewWorkItems:`);

        const workItems = req.body;
        const creator_id = req.user.id;
        const teamId = req.headers?.team_id;
        console.log("approverId:", creator_id);
        console.log("teamId:", teamId);
        console.log("workItems:", workItems?.length);

        if (workItems?.length === 0 || !creator_id || !teamId) {
            return res.status(400).json({ message: 'Invalid request' });
        }
        const headers = Object.keys(workItems[0]);
        const hasForbiddenHeaders = forbiddenHeaders.some(forbidden => headers.includes(forbidden));
        const hasRequiredHeaders = uploadRequiredHeaders.every(item => headers.includes(item));

        if (hasForbiddenHeaders || !hasRequiredHeaders) {
            return res.status(400).json({ message: 'Invalid data headers' });
        }

        const client = await pool.connect();
        try {
            const failedItems = [];

            for (const item of workItems) {
                const columns = Object.keys(item).join(', ');
                const values = Object.values(item);
                values.push(teamId, creator_id);

                const wildcards = values.map((_, index) => `$${index + 1}`).join(', ');
                const query = `INSERT INTO work_items (${columns}, team_id, created_by) VALUES (${wildcards})`;

                try {
                    await client.query('BEGIN');
                    await client.query(query, values);
                    await client.query('COMMIT');
                } catch (error) {
                    console.log(error);
                    const errData = new Object(item)
                    errData['error'] = error.message
                    failedItems.push(errData);
                    await client.query('ROLLBACK');
                }
            }

            if (failedItems.length > 0) {
                res.status(206).json({ message: 'Some work items failed to upload.', failedItems });
            } else {
                res.status(201).json({ message: 'Work items successfully uploaded.' });
            }
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Failed to upload work items.', error });
        } finally {
            client.release();
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Failed to upload work items.' });
    }
};