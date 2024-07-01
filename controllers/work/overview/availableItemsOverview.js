
const pool = require('../../../config/db');
const calculateColumnAge = require('../../../utils/queries')

module.exports = availableItemsOverview = async (req, res) => {
    try {
        const teamId = req.headers?.team_id;

        if (!teamId) {
            return res.status(400).json({ message: 'Invalid request' });
        }

        const ingestedAge = calculateColumnAge('wi.ingested_at', 'Ingested');
        const assignedAge = calculateColumnAge('wi.last_assigned_at', 'Assigned');
        const dueDateAge = calculateColumnAge('wi.due_date', 'Due Date');

        const query = `
            select
                wi.id,
                wi.aux_tool,
                wi.aux_id,
                wi.aux_status,
                wi.status,
                u.username,
                ${ingestedAge},
                ${assignedAge},
                ${dueDateAge}
            from
                work_items as wi
                left join users as u on u.id = wi.assignee_id
            where
                team_id = $1
                AND status in (
                    'Work in Progress',
                    'Unassigned',
                    'Reopened',
                    'Pending'
                )
            order by
                due_date
        `;

        const { rows } = await pool.query(query, [teamId]);

        res.json(rows);
    } catch (error) {
        console.log(error);
        res.status(500).send('Server error');
    }
}