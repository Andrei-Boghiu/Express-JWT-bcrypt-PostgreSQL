const pool = require('../../../config/db');

module.exports = truncateInflow = async (req, res) => {
    try {
        const teamId = req?.headers?.team_id;

        if (!teamId) {
            return res.status(400).json({ message: 'Invalid request' });
        }

        await pool.query(`DELETE FROM work_items WHERE team_id = $1`, [teamId]);

        return res.status(200).json({ message: 'Work items removed successfully.' });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Failed to remove work items.' });
    }
};