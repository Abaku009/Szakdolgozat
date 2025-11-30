const pool = require("../pool/pool");

async function insertMessage(vezeteknev, keresztnev, email, uzenet) {
    await pool.query(
        "INSERT INTO messages (first_name, last_name, email, message) VALUES ($1, $2, $3, $4)",
        [
            vezeteknev,
            keresztnev,
            email,
            uzenet
        ]
    );
}

module.exports = { insertMessage };

