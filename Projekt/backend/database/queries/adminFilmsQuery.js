const pool = require("../pool/pool");


async function softDeleteFilm(filmID) {
    await pool.query(
        `UPDATE films SET is_active = false WHERE film_id = $1`,
        [filmID]
    );
}


async function restoreFilm(filmID) {
    await pool.query(
        `UPDATE films SET is_active = true WHERE film_id = $1`,
        [filmID]
    );
}


async function deleteFilm(filmID) {
    const { rowCount } = await pool.query(
        `SELECT 1 FROM reservation_items WHERE film_id = $1`,
        [filmID]
    );

    if (rowCount > 0) {
        throw new Error("Film nem törölhető! Foglalás tartozik a filmhez!");
    }
    
    await pool.query(
        `DELETE FROM films WHERE film_id = $1`,
        [filmID]
    );
}


async function editFilm(filmId, data) {

    const client = await pool.connect();
    
    try {

        await client.query("BEGIN");

        
        if (data.title !== undefined) {
            await client.query(`UPDATE films SET title = $1 WHERE film_id = $2`, [data.title, filmId]);
        }


        if (data.price !== undefined) {
            await client.query(`UPDATE films SET price = $1 WHERE film_id = $2`, [data.price, filmId]);
        }


        if (data.director !== undefined) {
            await client.query(`UPDATE films SET director = $1 WHERE film_id = $2`, [data.director, filmId]);
        }


        if (data.format !== undefined) {
            await client.query(`UPDATE films SET format = $1 WHERE film_id = $2`, [data.format, filmId]);
        }


        if (data.film_language_id !== undefined) {
            await client.query(`UPDATE films SET film_language_id = $1 WHERE film_id = $2`, [data.film_language_id, filmId]);
        }


        if (data.film_category_id !== undefined) {
            await client.query(`UPDATE films SET film_category_id = $1 WHERE film_id = $2`, [data.film_category_id, filmId]);
        }


        if (data.quantity !== undefined) {
            await client.query(`
                UPDATE films_storage
                SET quantity = $1
                WHERE film_storage_id = (
                    SELECT film_storage_id FROM films WHERE film_id = $2
                )
            `, [data.quantity, filmId]);
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
        `INSERT INTO films_category (genre)
        VALUES ($1)`,
        [genre]
    );
}


async function insertLanguage(language) {
    await pool.query(
        `INSERT INTO films_language (language)
        VALUES ($1)`,
        [language]
    );
}


async function insertFilm(data) {
    const client = await pool.connect();

    try {
        await client.query("BEGIN");

        const storageResult = await client.query(
            `INSERT INTO films_storage (quantity)
             VALUES ($1)
             RETURNING film_storage_id`,
            [data.quantity]
        );

        const storageId = storageResult.rows[0].film_storage_id;

        await client.query(
            `INSERT INTO films (
                title,
                price,
                format,
                film_language_id,
                film_category_id,
                film_storage_id,
                director
            ) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
            [
                data.title,
                data.price,
                data.format,
                data.film_language_id,
                data.film_category_id,
                storageId,
                data.director
            ]
        );

        await client.query("COMMIT");

    } catch (err) {
        await client.query("ROLLBACK");
        throw err;
    } finally {
        client.release();
    }
    
}


async function filmHasOrder(filmId) {
    const { rowCount } = await pool.query(
        `SELECT 1 FROM reservation_items WHERE film_id = $1`,
        [filmId]
    );

    return rowCount > 0;
}


module.exports = { deleteFilm, softDeleteFilm, restoreFilm, editFilm, insertGenre, insertLanguage, insertFilm, filmHasOrder };

