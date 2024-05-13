const pool = require('../../config/db');



module.exports = addNewTeam = async (req, res) => {
    try {


    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({
            message: 'Error...',
            // error,
        });
    }
};

module.exports = requestAdminTeamAccess = async (req, res) => {
    try {
        //
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({
            message: 'Error...',
            // error,
        });
    }
};
