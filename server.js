const express = require('express');
const app = express();
const PORT = process.env.PORT || 3001;

const bodyParser = require('body-parser');
const cors = require('cors');
const corsOptions = require('./config/corsOptions');

const userRoutes = require('./routes/users');
const workRoutes = require('./routes/work');

app.use(cors(corsOptions));

app.use(bodyParser.json());
app.use('/api/users', userRoutes);
app.use('/api/work', workRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
