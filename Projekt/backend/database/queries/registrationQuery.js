const pool = require("../pool/pool");

async function insertNewUser(vezeteknev, keresztnev, email, jelszo) {
    await pool.query(
        "INSERT INTO users (first_name, last_name, email, hashed_password, is_admin) VALUES ($1, $2, $3, $4, $5)",
        [
            keresztnev,
            vezeteknev,
            email,
            jelszo,
            false
        ]
    );
}

async function checkEmail(email) {
    return pool.query("SELECT * FROM users WHERE email = $1", [email]);
}

module.exports = { insertNewUser, checkEmail };

