const pool = require('../../config/db');

module.exports = fetchCountAvailableWorkItems = async (req, res) => {
    try {
        const userId = req.user.id;
        const teamId = req.headers?.team_id;

        if (!userId || !teamId) {
            return res.status(400).json({ message: 'Invalid request' });
        }

        const query = `
         SELECT
                (
                    WITH
                        priority_ordered_work_items AS (
                            SELECT
                                *
                            FROM
                                work_items wi
                            WHERE
                                team_id = $2 -- ! HARDCODED
                                AND (
                                    wi.status IN ('Unassigned', 'Reopened')
                                    OR (
                                        wi.status = 'Work in Progress'
                                        AND AGE(NOW(), wi.last_assigned_at) > INTERVAL '3 hours'
                                    )
                                    OR (
                                        wi.status = 'Pending'
                                        AND wi.resolution = 'Follow Up'
                                        AND AGE(NOW(), wi.follow_up_date) > INTERVAL '12 hours'
                                    )
                                )
                                AND id NOT IN (
                                    SELECT
                                        id
                                    FROM
                                        work_items
                                    WHERE
                                        assignee_id = $1 -- ! HARDCODED
                                )
                        )
                    SELECT
                        COUNT(*) AS total_available_work_items
                    FROM
                        priority_ordered_work_items
                ) AS total_available_work_items;`;

        const { rows } = await pool.query(query, [userId, teamId]);
        const total_available_work_items = rows[0]?.total_available_work_items;

        return res.status(200).json({ total_available_work_items });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({
            message: 'Unexpected Server Error',
            // error,
        });
    }
};