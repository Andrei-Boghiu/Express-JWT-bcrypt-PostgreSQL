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
        // console.log("workItems:", workItems);

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

                // Sanitize the data to remove empty values
                const sanitizedItem = {};
                const keys = Object.keys(item);
                for (const key of keys) {
                    const value = item[key];
                    if (value) {
                        sanitizedItem[key] = value;
                    }
                }

                const { aux_id, ...rest } = sanitizedItem;
                const { rows: alreadyInDb } = await client.query(`SELECT status FROM work_items WHERE aux_id = $1 AND team_id = $2`, [aux_id, teamId]);

                if (alreadyInDb.length) {
                    try {
                        if (alreadyInDb[0].status === 'Work in Progress') {
                            const errData = { ...item, error: `Item ${aux_id} has been found in 'Work in Progress' status and refused to update due to safety measures.` }
                            failedItems.push(errData);
                            console.log('The status is:', alreadyInDb[0].status);
                            continue;
                        }

                        const columns = Object.keys(rest);

                        let setClause = ''
                        for (let [index, column] of columns.entries()) {
                            setClause = setClause + `${column} = $${index + 4}, `
                        }

                        const updateQuery = `UPDATE work_items SET ${setClause} updated_by = $1 WHERE team_id = $2 AND aux_id = $3`;
                        const restValues = Object.values(rest);
                        const values = [updated_by_id, teamId, aux_id, ...restValues];

                        await client.query(updateQuery, values);

                    } catch (error) {
                        console.log("Error updating existing item ->", error);
                        const errData = { ...item, error: error.message };
                        failedItems.push(errData);
                    }
                } else {
                    try {
                        const columns = Object.keys(sanitizedItem).join(', ');
                        const values = Object.values(sanitizedItem);
                        values.push(teamId, updated_by_id);

                        const wildcards = values.map((_, index) => `$${index + 1}`).join(', ');
                        const insertQuery = `INSERT INTO work_items (${columns}, team_id, created_by) VALUES (${wildcards})`;

                        await client.query(insertQuery, values);
                    } catch (error) {
                        console.log("Error uploading new item ->", error)
                        const errData = { ...item, error: error.message };
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
            console.log('in global 2x catch')
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