const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
const db = require('./database')
app.use(cors());
app.use(bodyParser.json());

const PORT = process.env.PORT || 3001;

const registerRoutes = require('./app/routes/register')
app.use('/api', registerRoutes)

const loginroutes = require('./app/routes/login')
app.use('/api', loginroutes)

const jobPostRoutes = require('./app/routes/job_post')
app.use('/api', jobPostRoutes)

const jobApplicationRoutes = require('./app/routes/job_application')
app.use('/api', jobApplicationRoutes)

const usersRoutes = require('./app/routes/users')
app.use('/api', usersRoutes)

app.get('/api', (req, res) => {
    res.json(
        { message: 'Welcome to Gradhub!' }
    )
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
})