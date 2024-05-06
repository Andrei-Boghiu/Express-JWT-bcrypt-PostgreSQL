const pool = require('../config/db');

const getUserItems = async (req, res) => {
    const userId = req.user.id;
    try {
        const { rows } = await pool.query(
            "SELECT * FROM work_items WHERE assigned_to = $1 AND status = 'in progress'",
            [userId],
        );
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
};

const adminAddItems = async (req, res) => {
    try {
        const workItems = req.body;
        const client = await pool.connect();

        try {
            await client.query('BEGIN');
            const query = `INSERT INTO work_items (title, description, status, priority) VALUES ($1, $2, $3, $4)`;

            for (const item of workItems) {
                await client.query(query, [
                    item.title,
                    item.description,
                    item?.status || 'pending',
                    item?.priority || 3,
                ]);
            }

            await client.query('COMMIT');
            res.status(201).json({ message: 'Work items successfully uploaded.' });
        } catch (error) {
            console.log(error);
            await client.query('ROLLBACK');
            res.status(500).json({ message: 'Failed to upload work items.', error });
        } finally {
            client.release();
        }
    } catch (error) {
        console.log(error);
    }
};

const assignNewItem = async (req, res) => {
    try {
        const userId = req.user.id;
        const client = await pool.connect();

        try {
            await client.query('BEGIN');

            const updateResult = await client.query(
                `
                UPDATE work_items
                SET assigned_to = $1, status = 'in progress'
                WHERE id = (
                    SELECT id FROM work_items
                    WHERE status = 'pending' 
                    ORDER BY priority ASC
                    LIMIT 1
                )
                RETURNING *;
                `,
                [userId],
            );

            if (updateResult.rows.length === 0) {
                res.status(404).send('No pending work items available.');
                return;
            }

            const { rows } = await client.query(
                "SELECT * FROM work_items WHERE assigned_to = $1 AND status = 'in progress'",
                [userId],
            );

            res.json(rows);

            await client.query('COMMIT');
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

const unassignWorkItem = async (req, res) => {
    const workItems = req.body;
    try {
        await pool.query(
            `UPDATE work_items
            SET assigned_to = NULL, status = 'pending'
            WHERE id = $1;`,
            [itemId],
        );

        res.status(201).json({ message: 'Work item unassigned successfully.' });
    } catch (error) {
        console.error('Error unassigning work item:', error);
        res.status(500).send('Failed to unassigned work item.');
    }
};

module.exports = { getUserItems, adminAddItems, assignNewItem, unassignWorkItem };
