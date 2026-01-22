const pool = require("../pool/pool");


async function softDeleteMusic(musicID) {
    await pool.query(
        `UPDATE music SET is_active = false WHERE music_id = $1`,
        [musicID]
    );
}


async function restoreMusic(musicID) {
    await pool.query(
        `UPDATE music SET is_active = true WHERE music_id = $1`,
        [musicID]
    );
}


async function deleteMusic(musicID) {
    const { rowCount } = await pool.query(
        `SELECT 1 FROM music_order_items WHERE music_id = $1`,
        [musicID]
    );

    if (rowCount > 0) {
        throw new Error("Zene nem törölhető! Rendelés tartozik a zenéhez!");
    }
    
    await pool.query(
        `DELETE FROM music WHERE music_id = $1`,
        [musicID]
    );
}

module.exports = { deleteMusic, softDeleteMusic, restoreMusic };

