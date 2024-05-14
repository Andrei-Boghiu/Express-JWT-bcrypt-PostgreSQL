const pool = require('../../config/db');

module.exports = requestCreateNewTeam = async (req, res) => {
    try {
        const createdBy = req.user.id;
        const teamName = req.body.teamName;
        const teamDescription = req.body.teamDescription;

        console.log({ createdBy, teamName, teamDescription });

        const query = `INSERT INTO teams (name, description, created_by, owned_by)
                        VALUES($1, $2, $3, $3)`

        await pool.query(query, [teamName, teamDescription, createdBy]);

        res.json({ message: 'Request to create a new team submitted successfully. An admin will have to approve it!' });
    } catch (error) {
        console.error('Error fetching approved teams:', error);
        res.status(500).json({
            message: 'Server error! Create new team request wan\'t processed.',
        });
    }
};