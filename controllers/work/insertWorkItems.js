const pool = require('../../config/db');

module.exports = insertWorkItems = async (req, res) => {
    try {
        const workItems = req.body;
        const approverId = req.user.id;
        const teamId = req.headers?.team_id;

        console.log("teamId:", teamId);
        console.log("approverId:", approverId);

        // console.log(workItems)
        const client = await pool.connect();
        try {
            await client.query('BEGIN');

            for (const item of workItems) {
                const keys = Object.keys(item);
                const columns = keys.toString().replaceAll(',', ', ');
                const valuesArr = Object.values(item);
                valuesArr.push(teamId)

                let wildcards = '';
                keys.forEach((_, index) => {
                    wildcards = wildcards + `$${index + 1}${index === keys.length - 1 ? '' : ', '}`;
                });

                const query = `INSERT INTO work_items (${columns}, team_id) VALUES(${wildcards})`;
                console.log(query);
                console.log(valuesArr);

                break
                // await client.query(query, valuesArr);
            }

            await client.query('COMMIT');
            res.status(201).json({ message: `Work items successfully uploaded.` });
        } catch (error) {
            console.log(error);
            await client.query('ROLLBACK');
            res.status(500).json({ message: 'Failed to upload work items.', error });
        } finally {
            client.release();
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Failed to upload work items.' });
    }
};
