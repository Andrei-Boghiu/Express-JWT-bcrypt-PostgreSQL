const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const userRoutes = require('./routes/users');
const corsOptions = require('./config/corsOptions');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use('/api/users', userRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
