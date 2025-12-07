const pool = require("../pool/pool");

async function insertMessage(vezeteknev, keresztnev, email, uzenet) {
    await pool.query(
        "INSERT INTO messages (last_name, first_name, email, message) VALUES ($1, $2, $3, $4)",
        [
            vezeteknev,
            keresztnev,
            email,
            uzenet
        ]
    );
}

module.exports = { insertMessage };

