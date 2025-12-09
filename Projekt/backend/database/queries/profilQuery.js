const pool = require("../pool/pool");

async function updateNewPassword(password, id) {
    return await pool.query(
        "UPDATE users SET hashed_password = $1 WHERE user_id = $2",
        [password, id]
    );
}

module.exports = { updateNewPassword };

