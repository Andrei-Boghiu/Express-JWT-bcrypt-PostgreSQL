const pool = require('../config/db');

const inProgress = async (req, res) => {
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

const insertWork = async (req, res) => {
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
        client.release();
        res.status(201).json({ message: 'Work items successfully uploaded.' });
    } catch (error) {
        console.log(error);
        await client.query('ROLLBACK');
        client.release();
        res.status(500).json({ message: 'Failed to upload work items.', error });
    }
};

module.exports = { inProgress, insertWork };
