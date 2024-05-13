const pool = require('../../config/db');

module.exports = createNewTeam = async (req, res) => {
    try {

        res.json({ message: 'Feature still in development' });
    } catch (error) {
        console.error('Error fetching approved teams:', error);
        res.status(500).json({
            message: 'Server error fetching data.',
        });
    }
};