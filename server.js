const express = require('express');
const app = express();

const cors = require('cors');
const corsOptions = require('./config/corsOptions');
const cookieParser = require('cookie-parser');
const verifyJWT = require('./middleware/verifyJWT');
const credentials = require('./middleware/credentials');

app.use(credentials);

app.use(cors(corsOptions));

app.use(express.urlencoded({ extended: false }));

app.use(cookieParser());

app.use(verifyJWT); // Above will be unprotected routes, below protected routes

const PORT = process.env.PORT || 3500;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
