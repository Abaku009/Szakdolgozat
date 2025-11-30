require("dotenv").config();

const { Pool } = require("pg");

module.exports = new Pool({
    host: process.env.HOSTNAME,
    user: process.env.USER,
    database: process.env.DATABASE,
    password: process.env.PASSWORD,
    port: process.env.DATABASEPORT,
});

