const rateLimit = require('express-rate-limit');

const limiter = () => {
    return rateLimit({
        windowMs: 60 * 1000, // 1 minutes
        limit: 100, // Limit each IP to 100 requests per `window` (here, per 1 minute).
        standardHeaders: 'draft-7',
        legacyHeaders: false,
    });
}

module.exports = limiter;