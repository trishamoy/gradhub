const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();
const db = require('../../database');

const secretKey = 'balmes-secret-key';

function authenticationToken(req, res, next) {
    const token = req.headers.authorization;

    if (!token) {
        return res.status(401).json({ err: 'Unauthorized' });
    }

    console.log(token)

    jwt.verify(token, secretKey, (err, user) => {
        if (err) {
            return res.status(401).json({ err });
        }

        req.user = user;
        next();
    })
}

router.post('/job_application/:job_seeker_id/:job_post_id', authenticationToken, async (req, res) => {
    let job_seeker_id = req.params.job_seeker_id;
    let job_post_id = req.params.job_post_id;

    try {
        const insertUserQuery = `INSERT INTO job_application (job_post_id, job_seeker_id) VALUES (?, ?)`;
        await db.promise().execute(insertUserQuery, [
            job_seeker_id,
            job_post_id,
        ]);

        res.status(200).json({ message: 'Job Application Successful'});
    } catch (err) {
        console.log(err);
        res.status(500).json({ err: 'Internal Server Error' })
    }
})

router.delete('/job_application/:job_application_id', authenticationToken, async (req, res) => {
    let job_application_id = req.params.job_application_id;

    try {
        db.query('DELETE FROM job_application WHERE id = ?', job_application_id, (err, result, fields) => {
            if (err) {
                console.error('Error deleting item:', err);
                res.status(500).json({
                    message: 'Internal server error'
                });
            } else {
                res.status(200).json(result);
            }
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ err: 'Internal Server Error' })
    }
})

module.exports = router;