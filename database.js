const mysql = require('mysql2');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'gradhub',
    connectionLimit: 10, // Adjust the limit as per your requirements
    connectTimeout: 10000, // Add a timeout for the connection

    // host: process.env.DB_HOST,
    // user: process.env.DB_USER,
    // password: process.env.DB_PASSWORD,
    // database: process.env.DB_DATABASE,
    // connectionLimit: 10,
    // connectTimeout: 10000,
});

// Handle connection errors
pool.on('error', (err) => {
    console.error('Database connection error:', err);
    // You can also implement reconnection logic here if needed
});

pool.connect((err) => {
    if (err) {
        console.log(err);
    } else {
        console.log('Connected to MySQL');
    }
})

module.exports = pool.promise();