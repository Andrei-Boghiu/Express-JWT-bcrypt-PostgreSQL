const authorize = (roles = []) => {
    // roles param can be a single role string or an array of roles
    if (typeof roles === 'string') {
        roles = [roles];
    }

    return (req, res, next) => {
        if (!req.user || (roles.length && !roles.includes(req.user.role))) {
            return res.status(403).json({ message: 'Forbidden' });
        }

        // authentication and authorization successful
        next();
    };
};

module.exports = authorize;
