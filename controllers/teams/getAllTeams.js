const pool = require('../../config/db');

module.exports = getAllTeams = async (req, res) => {
    try {
        const query = `
            SELECT  
                t.id as id,
                t.name as name,
                t.description as description,
                u1.email as created_by,
                u2.email as owned_by,
                t.approved as approved,
                u3.email as approved_by
            FROM teams AS t
            LEFT JOIN users AS u1 ON t.created_by = u1.id
            LEFT JOIN users AS u2 ON t.owned_by = u2.id
            LEFT JOIN users AS u3 ON t.approved_by = u3.id;`;

        const { rows } = await pool.query(query, []);

        res.json(rows);
    } catch (error) {
        console.error('Error fetching approved teams:', error);
        res.status(500).json({
            message: 'Server error fetching data.',
        });
    }
};
