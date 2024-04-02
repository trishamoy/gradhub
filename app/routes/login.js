const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const router = express.Router();
const db = require('../../database');

const secretKey = 'balmes-secret-key';

router.use(bodyParser.json())

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user is a job seeker
        const jobSeekerQuery = `SELECT * FROM job_seeker WHERE email = ?`;
        const [jobSeekerRows] = await db.promise().execute(jobSeekerQuery, [email]);

        if (jobSeekerRows.length > 0) {
            // User is a job seeker
            const user = jobSeekerRows[0];
            const passwordMatch = await bcrypt.compare(password, user.password);

            if (!passwordMatch) {
                return res.status(401).json({ err: 'Invalid Email or Password' });
            }

            const token = jwt.sign({ userId: user.id, email: user.email }, secretKey, { expiresIn: '1h' });
            return res.status(200).json({ message: 'Login Successful', token, userType: 'job_seeker' });
        }

        // Check if user is an employer
        const employerQuery = `SELECT * FROM employer WHERE work_email = ?`;
        const [employerRows] = await db.promise().execute(employerQuery, [email]);

        if (employerRows.length > 0) {
            // User is an employer
            const user = employerRows[0];
            const passwordMatch = await bcrypt.compare(password, user.password);

            if (!passwordMatch) {
                return res.status(401).json({ err: 'Invalid Email or Password' });
            }

            const token = jwt.sign({ userId: user.id, work_email: user.work_email }, secretKey, { expiresIn: '1h' });
            return res.status(200).json({ message: 'Login Successful', token, userType: 'employer' });
        }

        // If no user found, return an error
        return res.status(401).json({ err: 'Invalid Email or Password' });
    } catch (err) {
        console.log(err);
        res.status(500).json({ err: 'Internal Server Error' });
    }
});

module.exports = router