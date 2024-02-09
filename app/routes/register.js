const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const db = require('../../database');

router.post('/register/:type', async (req, res) => {
    let type = req.params.type;

    try {
        if (type === "job_seeker") {
            //? Job Seeker Registration
            const {
                fullname,
                country,
                region_province_state,
                city_municipality,
                street_address,
                birthday,
                gender,
                email,
                mobile_number,
                job_seeking_status,
                salary_expectation,
                work_experience,
                education,
                skills,
                resume,
                password
            } = req.body;

            const hashedPassword = await bcrypt.hash(password, 10);

            const insertUserQuery = `INSERT INTO job_seeker (fullname, country, region_province_state, city_municipality,
                                                        street_address, birthday, gender, email, mobile_number,
                                                        job_seeking_status, salary_expectation, work_experience,
                                                        education, skills, resume, password) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
            await db.promise().execute(insertUserQuery, [
                fullname,
                country,
                region_province_state,
                city_municipality,
                street_address,
                birthday,
                gender,
                email,
                mobile_number,
                job_seeking_status,
                salary_expectation,
                work_experience,
                education,
                skills,
                resume,
                hashedPassword
            ]);
        } else if (type === "employer") {
            //? Employer Registration
            const {
                first_name,
                last_name,
                work_email,
                position,
                mobile_number,
                company_name,
                company_size,
                hiring_needs,
                password
            } = req.body;

            const hashedPassword = await bcrypt.hash(password, 10);

            const insertUserQuery = `INSERT INTO employer (first_name, last_name, work_email, position, mobile_number,
                                                        company_name, company_size, hiring_needs, password) 
                                                        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
            await db.promise().execute(insertUserQuery, [
                first_name,
                last_name,
                work_email,
                position,
                mobile_number,
                company_name,
                company_size,
                hiring_needs,
                hashedPassword
            ]);
        } else {
            return res.status(400).json({ err: 'Invalid User Type' });
        }


        res.status(200).json({ message: 'User Registered Successfully' });
    } catch (err) {
        console.log(err);
        res.status(500).json({ err: 'Internal Server Error' });
    }
})

module.exports = router