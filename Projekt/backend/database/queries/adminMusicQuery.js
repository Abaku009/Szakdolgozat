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


async function editMusic(musicId, data) {

    const client = await pool.connect();
    
    try {
        await client.query("BEGIN");


        if (data.price !== undefined) {
            await client.query(`UPDATE music SET price = $1 WHERE music_id = $2`, [data.price, musicId]);
        }


        if (data.title !== undefined) {
            await client.query(`UPDATE music SET title = $1 WHERE music_id = $2`, [data.title, musicId]);
        }


        if (data.performer !== undefined) {
            await client.query(`UPDATE music SET performer = $1 WHERE music_id = $2`, [data.performer, musicId]);
        }


        if (data.format !== undefined) {
            await client.query(`UPDATE music SET format = $1 WHERE music_id = $2`, [data.format, musicId]);
        }


        if (data.music_language_id !== undefined) {
            await client.query(`UPDATE music SET music_language_id = $1 WHERE music_id = $2`, [data.music_language_id, musicId]);
        }


        if (data.music_category_id !== undefined) {
            await client.query(`UPDATE music SET music_category_id = $1 WHERE music_id = $2`, [data.music_category_id, musicId]);
        }


        if (data.quantity !== undefined) {
            await client.query(`
                UPDATE music_storage
                SET quantity = $1
                WHERE music_storage_id = (
                    SELECT music_storage_id FROM music WHERE music_id = $2
                )
            `, [data.quantity, musicId]);
        }


        await client.query("COMMIT");


    } catch (err) {
        await client.query("ROLLBACK");
        throw err;
    } finally {
        client.release();
    }
}


async function insertGenre(genre) {
    await pool.query(
        `INSERT INTO music_category (genre)
        VALUES ($1)`,
        [genre]
    );
}


async function insertLanguage(language) {
    await pool.query(
        `INSERT INTO music_language (language)
        VALUES ($1)`,
        [language]
    );
}


module.exports = { deleteMusic, softDeleteMusic, restoreMusic, editMusic, insertGenre, insertLanguage };

