const pool = require('../../config/db');

export const addNewTeam = async (req, res) => {
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

export const requestAdminTeamAccess = async (req, res) => {
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
