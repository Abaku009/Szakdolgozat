const pool = require("../pool/pool");

async function insertOnSiteReservation(userId, cart, mode, dateFrom, dateTo, timeFrom, timeTo) {
    const client = await pool.connect();

    try {
        await client.query("BEGIN");

        const reservatonResult = await client.query(
            `INSERT INTO reservations
            (user_id, mode, reserved_date_from, reserved_date_to, reserved_from, reserved_to)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING reservation_id`,
            [userId, mode, dateFrom, dateTo, timeFrom, timeTo]
        );

        const reservationID = reservatonResult.rows[0].reservation_id;

        for(const item of cart) {
            if(item.type === "film") {
                await client.query(
                    `INSERT INTO reservation_items
                    (reservation_id, film_id, quantity)
                    VALUES ($1, $2, $3)`,
                    [reservationID, item.film_id, item.qty]
                );

                const stockResult = await client.query(
                    `UPDATE films_storage
                    SET quantity = quantity - $1
                    WHERE film_storage_id = $2
                        AND quantity >= $1`,
                    [item.qty, item.film_storage_id]
                );

                if (stockResult.rowCount === 0) {
                    throw new Error("Nincs elegendő készlet!");
                }
            }

            if(item.type === "series") {
                await client.query(
                    `INSERT INTO reservation_items
                    (reservation_id, series_id, quantity)
                    VALUES ($1, $2, $3)`,
                    [reservationID, item.series_id, item.qty]
                );

                const stockResult = await client.query(
                    `UPDATE series_storage
                    SET quantity = quantity - $1
                    WHERE series_storage_id = $2
                        AND quantity >= $1`,
                    [item.qty, item.series_storage_id]
                );

                if (stockResult.rowCount === 0) {
                    throw new Error("Nincs elegendő készlet!");
                }
            }

        }

        await client.query("COMMIT");

        return reservationID;

    } catch(err) {
        await client.query("ROLLBACK");
        throw err;
    } finally {
        client.release();
    }
}

module.exports = { insertOnSiteReservation };

