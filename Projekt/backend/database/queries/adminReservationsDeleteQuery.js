const pool = require("../pool/pool");

async function deleteReservations(reservation) {
    const client = await pool.connect();

    try {
        await client.query("BEGIN");

        for (const item of reservation.items) {
            if (item.type === "film") {
                await client.query(
                    `
                    UPDATE films_storage
                    SET quantity = quantity + $1
                    WHERE film_storage_id = (
                        SELECT film_storage_id FROM films WHERE film_id = $2
                    )
                    `,
                    [item.quantity, item.id]
                );
            } else {
                await client.query(
                    `
                    UPDATE series_storage
                    SET quantity = quantity + $1
                    WHERE series_storage_id = (
                        SELECT series_storage_id FROM series WHERE series_id = $2
                    )
                    `,
                    [item.quantity, item.id]
                );
            }
        }

        await client.query(
            `DELETE FROM reservation_items WHERE reservation_id = $1`,
            [reservation.reservation_id]
        );

        await client.query(
            `DELETE FROM reservations WHERE reservation_id = $1`,
            [reservation.reservation_id]
        );

        await client.query("COMMIT");
    } catch (err) {
        await client.query("ROLLBACK");
        throw err;
    } finally {
        client.release();
    }
}

module.exports = { deleteReservations };

