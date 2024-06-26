const whitelist = [
    'https://www.replace-with-yoursite.com',
    'http://127.0.0.1:5656', // There's no place like 127.0.0.1
    'http://localhost:5656', // OG
    'http://localhost:3500', // Dave Gray's favorite
];

const corsOptions = {
    origin: function (origin, callback) {
        if (!origin || whitelist.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    optionsSuccessStatus: 200,
};

module.exports = corsOptions;
