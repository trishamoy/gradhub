const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const router = express.Router();
const db = require('../../database');

const secretKey = 'balmes-secret-key';

router.use(bodyParser.json())

router.post('/login/:type', async (req, res) => {
    let type = req.params.type;

    try {
        if (type === "job_seeker") {
            //? Job Seeker Login
            const {email, password} = req.body;

            const getUserQuery = `SELECT * FROM job_seeker WHERE email = ?`;
            const [rows] = await db.promise().execute(getUserQuery, [email]);

            if (rows.length === 0) {
                return res.status(401).json({err: 'Invalid Email or Password'});
            }

            const user = rows[0];
            const passwordMatch = await bcrypt.compare(password, user.password);

            if (!passwordMatch) {
                return res.status(401).json({err: 'Invalid Email or Password'});
            }

            const token = jwt.sign({userId: user.id, email: user.email}, secretKey, {expiresIn: '1h'});
            res.status(200).json({message: 'Login Successful', token});
        } else if (type === "employer") {
            //? Employer Login
            const {work_email, password} = req.body;

            const getUserQuery = `SELECT * FROM employer WHERE work_email = ?`;
            const [rows] = await db.promise().execute(getUserQuery, [work_email]);

            if (rows.length === 0) {
                return res.status(401).json({err: 'Invalid Email or Password'});
            }

            const user = rows[0];
            const passwordMatch = await bcrypt.compare(password, user.password);

            if (!passwordMatch) {
                return res.status(401).json({err: 'Invalid Email or Password'});
            }

            const token = jwt.sign({userId: user.id, work_email: user.work_email}, secretKey, {expiresIn: '1h'});
            res.status(200).json({message: 'Login Successful', token});
        } else {
            res.status(400).json({err: 'Invalid Login Type'});
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({err: 'Internal Server Error'})
    }
})

module.exports = router