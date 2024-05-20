const pool = require('../../config/db');

module.exports = lobby = async (req, res) => {
    const userId = req.user.id;

    console.log("lobby");
    try {
        const { rows } = await pool.query(
            "SELECT * FROM work_items WHERE assignee_id = $1 AND status = 'Work in Progress'",
            [userId],
        );
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
};
