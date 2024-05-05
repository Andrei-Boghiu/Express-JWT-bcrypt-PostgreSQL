const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

const bodyParser = require('body-parser');
const cors = require('cors');
const corsOptions = require('./config/corsOptions');

const userRoutes = require('./routes/users');

app.use(cors(corsOptions));

app.use(bodyParser.json());
app.use('/api/users', userRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
