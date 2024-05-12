const pool = require('../../config/db');

module.exports = completeWorkItem = async (req, res) => {
    try {
        const { workItemId } = req.body;
        const { id } = req.user;

        // console.log(`UserId: ${id} \nWorkItemId: ${workItemId}`);

        await pool.query(
            `UPDATE work_items
            SET assigned_to = $1, status = 'completed'
            WHERE id = $2;`,
            [id, workItemId],
        );

        res.status(201).json({ message: 'Work item completed successfully.' });
    } catch (error) {
        console.error('Error completing work item:', error);
        res.status(500).send('Failed to unassigned work item.');
    }
};
