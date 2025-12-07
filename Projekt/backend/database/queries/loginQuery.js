const pool = require("../pool/pool");

async function getUserEmail(email) {
    return pool.query("SELECT * FROM users WHERE email = $1", [email]);
}

async function getUserID(id) {
    return pool.query("SELECT * FROM users WHERE user_id = $1", [id]);
}

module.exports = { getUserEmail, getUserID };

