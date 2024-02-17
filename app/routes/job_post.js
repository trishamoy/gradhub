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

router.get('/job_post', authenticationToken, async (req, res) => {

    try {
        db.query(`SELECT * FROM job_post`, (err, result) => {

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

router.post('/job_post/:id', authenticationToken, async (req, res) => {
    let employer_id = req.params.id;

    try {
        const {
            job_position,
            company_name,
            address,
            salary_range,
            job_description,
            minimum_qualification,
            job_type,
            employment_type,
            perks_benefits,
            required_skills,
            job_summary,
            about_us
        } = req.body;

        const insertUserQuery = `INSERT INTO job_post (job_position, company_name, address, salary_range,
                                                        job_description, minimum_qualification, job_type, employment_type, perks_benefits,
                                                        required_skills, job_summary, about_us, employer_id) VALUES 
                                                        (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        await db.promise().execute(insertUserQuery, [
            job_position,
            company_name,
            address,
            salary_range,
            job_description,
            minimum_qualification,
            job_type,
            employment_type,
            perks_benefits,
            required_skills,
            job_summary,
            about_us,
            employer_id
        ]);

        res.status(200).json({ message: 'Job Post Created' });
    } catch (err) {
        console.log(err);
        res.status(500).json({ err: 'Internal Server Error' })
    }
})

router.get('/job_post', authenticationToken, async (req, res) => {

    try {
        db.query('SELECT * FROM job_post', (err, result) => {
            if (err) {
                res.status(500).json({err: 'Internal Server Error'});
            } else {
                res.status(200).json(result);
            }
        })
    } catch (err) {
        console.log(err);
        res.status(500).json({err: 'Internal Server Error'})
    }
})

router.put('/job_post/:id', authenticationToken, async (req, res) => {
    let job_post_id = req.params.id;
    try {
        const {
            job_position,
            company_name,
            address,
            salary_range,
            job_description,
            minimum_qualification,
            job_type,
            employment_type,
            perks_benefits,
            required_skills,
            job_summary,
            about_us
        } = req.body;

        db.query('UPDATE job_post SET job_position = ?, company_name = ?, address = ?, salary_range = ?, job_description = ?, minimum_qualification = ?, job_type = ?, employment_type = ?, perks_benefits = ?, required_skills = ?, job_summary = ?, about_us = ? WHERE id = ?',
        [
            job_position,
            company_name,
            address,
            salary_range,
            job_description,
            minimum_qualification,
            job_type,
            employment_type,
            perks_benefits,
            required_skills,
            job_summary,
            about_us, job_post_id], (err, result, fields ) => {
            if (err) {
                res.status(500).json({err: 'Internal Server Error'});
            } else {
                res.status(200).json(result);
            }
        })
    } catch (err) {
        console.log(err);
        res.status(500).json({err: 'Internal Server Error'})
    }
})

router.delete('/job_post/:id', authenticationToken, async (req, res) => {
    let job_post_id = req.params.id;
    if (!job_post_id) {
        return res.status(400).send({
            error: true,
            message: 'Please provide job_post_id'
        });
    }
    try {
        db.query('DELETE FROM job_post WHERE id = ?', job_post_id, (err, result) => {
            if (err) {
                res.status(500).json({err: 'Internal Server Error'});
            } else {
                res.status(200).json(result);
            }
        })
    } catch (err) {
        console.log(err);
        res.status(500).json({err: 'Internal Server Error'})
    }
})

module.exports = router