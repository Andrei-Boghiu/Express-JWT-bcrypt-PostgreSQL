const { userStatusChange } = require("../config")
const pool = require('../../../config/db');

module.exports = updateStatus = async (req, res) => {
    try {
        const aux_id = req.body?.aux_id;
        const newStatus = req.body?.status;
        const resolution = req.body?.resolution;
        const annotation = req.body?.annotation;
        const followUp = req.body?.follow_up_date;

        const user_id = req.user.id;
        const teamId = req.headers?.team_id;

        const resolutionCheck = newStatus !== "Unassigned" ? resolution : true;
        const validStatus = userStatusChange.includes(newStatus);

        if (!aux_id || !newStatus || !validStatus || !teamId || !resolutionCheck) {
            return res.status(400).json({ message: 'Invalid request' });
        }

        const updateQuery = `
        UPDATE work_items 
            SET 
            status = $1, 
            resolution = $2,
            ${annotation ? `annotation = '${annotation}',` : ''}
            ${followUp ? `follow_up_date = '${followUp}',` : ''}
            last_resolved_at = CURRENT_TIMESTAMP,
            updated_by = $3
        WHERE team_id = $4 AND aux_id = $5`;
        const updateData = [newStatus, resolution, user_id, teamId, aux_id];

        const resolveQuery = `
        UPDATE work_items 
            SET 
            status = $1, 
            resolution = $2,
            ${annotation ? `annotation = '${annotation}',` : ''}
            ${followUp ? `follow_up_date = '${followUp}',` : ''}
            assignee_id = null,
            last_resolved_at = CURRENT_TIMESTAMP,
            updated_by = $3
        WHERE team_id = $4 AND aux_id = $5`;
        const resolveData = [newStatus, resolution, user_id, teamId, aux_id];

        const releaseItemQuery = `
            UPDATE work_items 
            SET 
            status = 'Unassigned', 
            assignee_id = null,
            annotation = 'Release reason: ${annotation}', 
            last_resolved_at = CURRENT_TIMESTAMP,
            updated_by = $1 
        WHERE team_id = $2 AND aux_id = $3`;
        const releaseData = [user_id, teamId, aux_id];

        if (newStatus === "Unassigned") {
            await pool.query(releaseItemQuery, releaseData);
        } else if (newStatus === "Resolved") {
            await pool.query(resolveQuery, resolveData);
        } else {
            await pool.query(updateQuery, updateData);
        }

        res.status(200).json({ message: 'Success' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Failed to upload work items.' });
    }
};