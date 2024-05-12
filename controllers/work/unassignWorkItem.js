const pool = require('../../config/db');

module.exports = unassignWorkItem = async (req, res) => {
    try {
        const { workItemId } = req.body;
        // const { id } = req.user;
        // console.log(`UserId: ${id} \nWorkItemId: ${workItemId}`);

        await pool.query(
            `UPDATE work_items
            SET assigned_to = NULL, status = 'pending'
            WHERE id = $1;`,
            [workItemId],
        );

        res.status(201).json({ message: 'Work item unassigned successfully.' });
    } catch (error) {
        console.error('Error unassigning work item:', error);
        res.status(500).send('Failed to unassigned work item.');
    }
};
