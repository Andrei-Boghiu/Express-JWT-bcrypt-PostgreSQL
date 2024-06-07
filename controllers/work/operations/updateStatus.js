// transferWorkItem
const { userStatusChange } = require("../config")
const pool = require('../../../config/db');

module.exports = updateStatus = async (req, res) => {
    try {
        const body = req.body;
        const aux_id = req.body?.aux_id;
        const newStatus = req.body?.status;
        const resolution = req.body?.resolution;
        const annotation = req.body?.annotation;
        const followUp = req.body?.follow_up_date;

        const user_id = req.user.id;
        const teamId = req.headers?.team_id;

        console.log("------" + new Date().toISOString() + "------")
        console.log("body:", body);

        const resolutionCheck = newStatus !== "Unassigned" ? resolution : true;
        const validStatus = userStatusChange.includes(newStatus);

        if (!aux_id || !newStatus || !validStatus || !teamId || !resolutionCheck) {
            return res.status(400).json({ message: 'Invalid request' });
        }

        const updateQuery = `
        UPDATE work_items 
            SET 
            status = '${newStatus}', 
            resolution = '${resolution}',
            ${annotation ? `annotation = '${annotation}',` : ''}
            ${followUp ? `follow_up_date = '${followUp}',` : ''}
            last_resolved_at = CURRENT_TIMESTAMP,
            updated_by = ${user_id} 
        WHERE team_id = ${teamId} AND aux_id = '${aux_id}'`;

        const releaseItemQuery = `
            UPDATE work_items 
            SET 
            status = 'Unassigned', 
            assignee_id = null,
            annotation = 'Release reason: ${annotation}', 
            last_resolved_at = CURRENT_TIMESTAMP,
            updated_by = ${user_id} 
        WHERE team_id = ${teamId} AND aux_id = '${aux_id}'`;

        if (newStatus === "Unassigned") {
            console.log(releaseItemQuery)
            await pool.query(releaseItemQuery);
            console.log("Query executed successfully");
        } else {
            console.log(updateQuery)
            await pool.query(updateQuery);
            console.log("Query executed successfully");
        }

        res.status(200).json({ message: 'Success' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Failed to upload work items.' });
    }
};