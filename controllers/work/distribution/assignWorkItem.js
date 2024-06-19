const pool = require('../../../config/db');

module.exports = assignWorkItem = async (req, res) => {
    try {
        console.log("assignWorkItem")
        const userId = req.user.id;
        const teamId = req.headers?.team_id;

        if (!userId || !teamId) {
            return res.status(400).json({ message: 'Invalid request' });
        }

        const client = await pool.connect();
        try {
            await client.query('BEGIN');

            const updateResult = await client.query(
                `
                UPDATE work_items
                SET assignee_id = $1, status = 'Work in Progress', last_assigned_at = CURRENT_TIMESTAMP
                WHERE id = (
                    WITH
                        priority_ordered_work_items AS (
                            SELECT
                                CASE
                                    WHEN EXISTS (
                                        SELECT
                                            1
                                        FROM
                                            users u
                                        WHERE
                                            split_part (u.email, '@', 1) = wi.aux_owner
                                            AND u.id = $1 -- ! HARDCODED
                                    ) THEN wi.priority - 2
                                    WHEN EXISTS (
                                        SELECT
                                            1
                                        FROM
                                            users u
                                        WHERE
                                            u.email = wi.aux_owner
                                            AND u.id = $1 -- ! HARDCODED
                                    ) THEN wi.priority - 2
                                    ELSE wi.priority
                                END AS priority_calc_1,
                                CASE
                                    WHEN AGE (NOW (), wi.follow_up_date) > INTERVAL '12 hours' THEN wi.priority - 2
                                    ELSE wi.priority
                                END AS priority_calc_2,
                                CASE
                                    WHEN AGE (wi.due_date, NOW ()) < INTERVAL '0' THEN wi.priority + 2
                                    ELSE wi.priority
                                END AS priority_calc_3,
                                CASE
                                    WHEN wi.status = 'Reopened'
                                    AND wi.updated_by = $1 THEN wi.priority - 1 -- ! HARDCODED
                                    ELSE wi.priority
                                END AS priority_calc_4,
                                CASE
                                    WHEN wi.status = 'Work in Progress'
                                    AND AGE (NOW (), wi.last_assigned_at) > INTERVAL '3 hours' THEN wi.priority - 1
                                    ELSE wi.priority
                                END AS priority_calc_5,
                                id
                            FROM
                                work_items wi
                            WHERE
                                team_id = $2 -- ! HARDCODED
                                AND (
                                    wi.status IN ('Unassigned', 'Reopened')
                                    OR (
                                        wi.status = 'Work in Progress'
                                        AND AGE (NOW(), wi.last_assigned_at) > INTERVAL '3 hours'
                                    )
                                    OR (
                                        wi.status = 'Pending'
                                        AND wi.resolution = 'Follow Up'
                                        AND AGE (NOW(), wi.follow_up_date) > INTERVAL '12 hours'
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
                                id
                            FROM
                                priority_ordered_work_items
                            ORDER BY
                                priority_calc_1 + priority_calc_2 + priority_calc_3 + priority_calc_4 + priority_calc_5,
                                due_date
                            LIMIT 1
                            )
                            RETURNING *;
                `,
                [userId, teamId],
            );

            if (updateResult.rows.length === 0) {
                res.status(404).send('No pending work items available.');
                await client.query('COMMIT');
                return
            }
            await client.query('COMMIT');

            const { rows } = await pool.query(
                `SELECT 
                    id,
                    aux_id,
                    aux_tool,
                    aux_status,
                    status,
                    resolution,
                    priority,
                    due_date,
                    follow_up_date,
                    annotation
                FROM work_items 
                WHERE assignee_id = $1 AND team_id = $2
                    AND status NOT IN ('Resolved', 'Removed')`,
                [userId, teamId],
            );

            res.json(rows);

        } catch (error) {
            console.log('Transaction failed:', error);
            await client.query('ROLLBACK');
            res.status(500).send('Failed to assign work item.');
        } finally {
            client.release();
        }
    } catch (error) {
        console.log('Failed to connect to the database:', error);
        res.status(500).send('Database connection failed.');
    }
};
