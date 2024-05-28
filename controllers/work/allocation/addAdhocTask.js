// This will be for adhoc tasks like "Send a progress-of-the-week email to stakeholders"
// the aux_id will be auto generated - due date will be required, otherwise will be set due in 72h 
// 

const pool = require('../../../config/db');

module.exports = addAdhocTasks = async (req, res) => {
    try {
        console.log(`addAdhocTasks:`)
        const workItems = req.body;
        const creator_id = req.user.id;
        const teamId = req.headers?.team_id;

        console.log("approverId:", creator_id);
        console.log("teamId:", teamId);

        console.log(workItems)
        // const client = await pool.connect();
        // try {
        //     await client.query('BEGIN');


        //     await client.query('COMMIT');
        //     res.status(201).json({ message: `Work items successfully uploaded.` });
        // } catch (error) {
        //     console.log(error);
        //     await client.query('ROLLBACK');
        //     res.status(500).json({ message: 'Failed to upload work items.', error });
        // } finally {
        //     client.release();
        // }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Failed to upload work items.' });
    }
};
