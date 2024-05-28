// transferWorkItem
const { userStatusChange } = require("../config")
const pool = require('../../../config/db');

module.exports = updateStatus = async (req, res) => {
    try {
        const newStatus = req.body?.status;
        const aux_id = req.body?.aux_id;
        const user_id = req.user.id;
        const teamId = req.headers?.team_id;

        console.log("approverId:", creator_id);
        console.log("teamId:", teamId);

        const validStatus = userStatusChange.includes(newStatus);

        if (!aux_id || !newStatus || !validStatus || !teamId) {
            return res.status(400).json({ message: 'Invalid request' });
        }

        const updateQuery = `
        UPDATE work_items 
            SET 
            status = '${newStatus}', 
            last_resolved_at = CURRENT_TIMESTAMP WITH TIMEZONE,
            updated_by = ${user_id} 
        WHERE team_id = ${teamId} AND aux_id = '${aux_id}'`;
        await client.query(updateQuery);

        return res.status(200)
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Failed to upload work items.' });
    }
};
