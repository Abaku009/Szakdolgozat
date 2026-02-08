const pool = require("../pool/pool");


async function softDeleteSerie(serieID) {
    await pool.query(
        `UPDATE series SET is_active = false WHERE series_id = $1`,
        [serieID]
    );
}


async function restoreSerie(serieID) {
    await pool.query(
        `UPDATE series SET is_active = true WHERE series_id = $1`,
        [serieID]
    );
}


async function deleteSerie(serieID) {
    const { rowCount } = await pool.query(
        `SELECT 1 FROM reservation_items WHERE series_id = $1`,
        [serieID]
    );

    if (rowCount > 0) {
        throw new Error("Sorozat nem törölhető! Foglalás tartozik a sorozathoz!");
    }
    
    await pool.query(
        `DELETE FROM series WHERE series_id = $1`,
        [serieID]
    );
}


async function editSerie(serieId, data) {

    const client = await pool.connect();
    
    try {

        await client.query("BEGIN");

        
        if (data.title !== undefined) {
            await client.query(`UPDATE series SET title = $1 WHERE series_id = $2`, [data.title, serieId]);
        }


        if (data.price !== undefined) {
            await client.query(`UPDATE series SET price = $1 WHERE series_id = $2`, [data.price, serieId]);
        }


        if (data.creator !== undefined) {
            await client.query(`UPDATE series SET creator = $1 WHERE series_id = $2`, [data.creator, serieId]);
        }


        if (data.format !== undefined) {
            await client.query(`UPDATE series SET format = $1 WHERE series_id = $2`, [data.format, serieId]);
        }


        if (data.series_language_id !== undefined) {
            await client.query(`UPDATE series SET series_language_id = $1 WHERE series_id = $2`, [data.series_language_id, serieId]);
        }


        if (data.series_category_id !== undefined) {
            await client.query(`UPDATE series SET series_category_id = $1 WHERE series_id = $2`, [data.series_category_id, serieId]);
        }


        if (data.quantity !== undefined) {
            await client.query(`
                UPDATE series_storage
                SET quantity = $1
                WHERE series_storage_id = (
                    SELECT series_storage_id FROM series WHERE series_id = $2
                )
            `, [data.quantity, serieId]);
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
        `INSERT INTO series_category (genre)
        VALUES ($1)`,
        [genre]
    );
}


async function insertLanguage(language) {
    await pool.query(
        `INSERT INTO series_language (language)
        VALUES ($1)`,
        [language]
    );
}


async function insertSerie(data) {
    const client = await pool.connect();

    try {
        await client.query("BEGIN");

        const storageResult = await client.query(
            `INSERT INTO series_storage (quantity)
             VALUES ($1)
             RETURNING series_storage_id`,
            [data.quantity]
        );

        const storageId = storageResult.rows[0].series_storage_id;

        await client.query(
            `INSERT INTO series (
                title,
                price,
                format,
                series_language_id,
                series_category_id,
                series_storage_id,
                creator
            ) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
            [
                data.title,
                data.price,
                data.format,
                data.series_language_id,
                data.series_category_id,
                storageId,
                data.creator
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


async function serieHasOrder(serieId) {
    const { rowCount } = await pool.query(
        `SELECT 1 FROM reservation_items WHERE series_id = $1`,
        [serieId]
    );

    return rowCount > 0;
}


module.exports = { deleteSerie, softDeleteSerie, restoreSerie, editSerie, insertGenre, insertLanguage, insertSerie, serieHasOrder };

