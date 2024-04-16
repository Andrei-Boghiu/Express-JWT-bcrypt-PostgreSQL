const express = require('express');
const app = express();

const cors = require('cors');
const corsOptions = require('./config/corsOptions');
const cookieParser = require('cookie-parser');

app.use(cors(corsOptions));

app.use(express.urlencoded({ extended: false }));

app.use(cookieParser());

const PORT = process.env.PORT || 3500;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
