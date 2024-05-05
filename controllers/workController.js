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
    const userId = req.user.id;
    try {
        const { rows } = await pool.query('SELECT NOW()', []);
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
};

module.exports = { inProgress };
