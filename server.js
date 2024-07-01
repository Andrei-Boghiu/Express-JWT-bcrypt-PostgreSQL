const express = require('express');
const app = express();
const PORT = process.env.PORT || 3001;

const bodyParser = require('body-parser');

const limiter = require('./middlewares/rateLimiter');
const rateLimiter = limiter();

const cors = require('cors');
const corsOptions = require('./config/corsOptions');

const userRoutes = require('./routes/users');
const teamRoutes = require('./routes/teams')
const workRoutes = require('./routes/work');
const statsRoutes = require('./routes/statistics');

app.use(rateLimiter)
app.use(cors(corsOptions));

app.use(bodyParser.json());
app.use('/api/users', userRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/work', workRoutes);
app.use('/api/stats', statsRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});