const pool = require('../../config/db');

module.exports = getAllUsers = async (req, res) => {
    try {
        // const userId = req.user.id;
        // const publicColumns = 'id, email, first_name, last_name, role, team_id, isAdmin, isTeamAdmin, isManager, isAllocator, active, last_login, approved';
        const query = `
                select 
                    u.id,
                    u.email,
                    u.first_name,
                    u.last_name,
                    u.created_at,
                    u.active,
                    TRIM(
                        COALESCE(
                            NULLIF(EXTRACT(YEAR FROM AGE(NOW(), u.last_login))::TEXT || ' years', '0 years'), 
                            ''
                        ) || ' ' || 
                        COALESCE(
                            NULLIF(EXTRACT(MONTH FROM AGE(NOW(), u.last_login))::TEXT || ' months', '0 months'), 
                            ''
                        ) || ' ' || 
                        COALESCE(
                            NULLIF(EXTRACT(DAY FROM AGE(NOW(), u.last_login))::TEXT || ' days', '0 days'), 
                            ''
                        ) || ' ' || 
                        COALESCE(
                            NULLIF(EXTRACT(HOUR FROM AGE(NOW(), u.last_login))::TEXT || ' hours', '0 hours'), 
                            ''
                        ) || ' ' || 
                        COALESCE(
                            NULLIF(EXTRACT(MINUTE FROM AGE(NOW(), u.last_login))::TEXT || ' minutes', '0 minutes'), 
                            ''
                        )
                    ) AS "Last Login",
                    count(CASE WHEN t.approved = true THEN 1 END) as memberships,
                    count(CASE WHEN t.approved = false THEN 1 END) as pending_memberships
                FROM users AS u
                LEFT JOIN user_teams AS t ON u.id = t.user_id
                GROUP BY u.id;`;
        const { rows } = await pool.query(query);

        if (rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(rows);
    } catch (error) {
        console.error('Error fetching all users:', error);
        res.status(500).json({
            message: 'Error fetching users',
        });
    }
};
