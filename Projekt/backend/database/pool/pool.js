const { Pool } = require("pg");

const pool = new Pool({
    user: process.env.USER,
    password: process.env.PASSWORD,
    host: process.env.HOSTNAME,
    port: process.env.DATABASEPORT,
    database: process.env.DATABASE
});

module.exports = pool;

