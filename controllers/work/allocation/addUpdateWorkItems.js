const pool = require('../../../config/db');
const { forbiddenHeaders, updateSomeHeaders } = require("../config");

module.exports = addUpdateWorkItems = async (req, res) => {
    try {
        console.log(`addUpdateWorkItems:`);

        const workItems = req.body;
        const updated_by_id = req.user.id;
        const teamId = req.headers?.team_id;

        console.log("approverId:", updated_by_id);
        console.log("teamId:", teamId);
        console.log("workItems:", workItems);

        if (workItems?.length === 0 || !updated_by_id || !teamId) {
            res.status(400).json({ message: 'Invalid request' });
            return
        }

        const headers = Object.keys(workItems[0]);
        const hasForbiddenHeaders = forbiddenHeaders.some(forbidden => headers.includes(forbidden));
        const hasRequiredHeaders = ["aux_id"].every(item => headers.includes(item));
        const hasSomeUpdateHeaders = updateSomeHeaders.some(item => headers.includes(item));

        if (hasForbiddenHeaders || !hasRequiredHeaders || !hasSomeUpdateHeaders) {
            res.status(400).json({ message: 'Invalid data headers' });
            return
        }

        const client = await pool.connect();
        try {
            const failedItems = [];

            for (const item of workItems) {
                const { aux_id, ...rest } = item;
                const setClause = Object.entries(rest)
                    .map(([key, value]) => `${key} = '${value}'`)
                    .join(', ');

                const updateQuery = `UPDATE work_items SET ${setClause}, updated_by = ${updated_by_id} WHERE team_id = ${teamId} AND aux_id = '${aux_id}'`;
                const updateResult = await client.query(updateQuery);

                if (updateResult.rowCount === 0) {
                    const columns = Object.keys(rest).join(', ');
                    const values = Object.values(rest);
                    values.push(teamId, updated_by_id);

                    const wildcards = values.map((_, index) => `$${index + 1}`).join(', ');
                    const insertQuery = `INSERT INTO work_items (${columns}, team_id, created_by) VALUES (${wildcards})`;

                    try {
                        await client.query(insertQuery, values);
                    } catch (error) {
                        const errData = { ...rest, error: error.message };
                        failedItems.push(errData);
                    }
                }
            }

            if (failedItems.length > 0) {
                res.status(206).json({ message: 'Some work items failed to update.', failedItems });
            } else {
                res.status(201).json({ message: 'Work items successfully updated.' });
            }
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Failed to update work items.', error });
        } finally {
            client.release();
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Failed to update work items.' });
    }
};