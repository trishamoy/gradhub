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

    jwt.verify(token, secretKey, (err, user) => {
        if (err) {
            return res.status(401).json({ err });
        }

        req.user = user;
        next();
    })
}

router.get('/users/employer', authenticationToken, async (req, res) => {

    try {
        db.query(`SELECT * FROM employer`, (err, result) => {

            if (err) {
                console.error('Error fetching item:', err);
                res.status(500).json({
                    message: 'Internal Server Error'
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


router.get('/users/job_seeker', authenticationToken, async (req, res) => {

    try {
        db.query(`SELECT * FROM job_seeker`, (err, result) => {

            if (err) {
                console.error('Error fetching item:', err);
                res.status(500).json({
                    message: 'Internal Server Error'
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

module.exports = router