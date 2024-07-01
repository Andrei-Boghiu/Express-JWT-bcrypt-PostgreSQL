const pool = require('../../../config/db');
const { forbiddenHeaders, updateSomeHeaders } = require("../config");

module.exports = updateWorkItems = async (req, res) => {
    try {
        const workItems = req.body;
        const updated_by_id = req.user.id;
        const teamId = req.headers?.team_id;

        if (workItems?.length === 0 || !updated_by_id || !teamId) {
            return res.status(400).json({ message: 'Invalid request' });
        }

        const headers = Object.keys(workItems[0]);
        const hasForbiddenHeaders = forbiddenHeaders.some(forbidden => headers.includes(forbidden));
        const hasRequiredHeaders = ["aux_id"].every(item => headers.includes(item));
        const hasSomeUpdateHeaders = updateSomeHeaders.some(item => headers.includes(item));

        if (hasForbiddenHeaders || !hasRequiredHeaders || !hasSomeUpdateHeaders) {
            return res.status(400).json({ message: 'Invalid data headers' });
        }

        const client = await pool.connect();
        try {
            const failedItems = [];

            for (const item of workItems) {
                const { aux_id, ...rest } = item;
                const setClause = Object.entries(rest)
                    .map(([key, value]) => `${key} = '${value}'`)
                    .join(', ');

                const query = `UPDATE work_items SET ${setClause} WHERE team_id = ${teamId} AND aux_id = '${aux_id}'`;
                console.log(query);

                try {
                    await client.query('BEGIN');
                    const result = await client.query(query);

                    if (result.rowCount === 0) {
                        const errData = new Object(item)
                        errData['error'] = 'aux_id not found in the database! Nothing was changed!'
                        failedItems.push(errData);
                    }

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
                return res.status(206).json({ message: 'Some work items failed to update.', failedItems });
            } else {
                return res.status(201).json({ message: 'Work items successfully updated.' });
            }
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Failed to update work items.', error });
        } finally {
            client.release();
        }
        return;
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Failed to update work items.' });
    }
};