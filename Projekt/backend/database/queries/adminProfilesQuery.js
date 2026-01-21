const pool = require("../pool/pool");

async function getAllProfiles() {
    const query = `
        SELECT
            user_id,
            first_name,
            last_name,
            email
        FROM users
        WHERE is_admin = false
        ORDER BY user_id;
    `;

    const result = await pool.query(query);
    return result.rows;
}

module.exports = { getAllProfiles };

