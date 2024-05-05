const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    // Expecting the token to be in the 'Authorization' header in the format 'Bearer [token]'
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res
            .status(401)
            .json({ message: 'Access denied. No token provided or invalid token format.' });
    }

    const token = authHeader.split(' ')[1]; // Extract the token from 'Bearer [token]'

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(403).json({ message: 'Invalid or expired token.' });
    }
};

module.exports = verifyToken;
