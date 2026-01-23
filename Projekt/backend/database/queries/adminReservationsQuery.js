const pool = require("../pool/pool");

async function getAllUsersReservations() {
    const query = `
        SELECT
            users.user_id,
            users.first_name,
            users.last_name,
            users.email,
            reservations.reservation_id,
            reservations.mode,
            to_char(reservations.reserved_date_from, 'YYYY-MM-DD') AS reserved_date_from,
            to_char(reservations.reserved_date_to, 'YYYY-MM-DD') AS reserved_date_to,
            reservations.reserved_from,
            reservations.reserved_to,
            reservation_items.quantity,
            reservation_items.film_id,
            reservation_items.series_id,
            films.title AS film_title,
            series.title AS series_title
        FROM users
        LEFT JOIN reservations ON reservations.user_id = users.user_id
        LEFT JOIN reservation_items ON reservation_items.reservation_id = reservations.reservation_id
        LEFT JOIN films ON reservation_items.film_id = films.film_id
        LEFT JOIN series ON reservation_items.series_id = series.series_id
        WHERE users.is_admin = false
        ORDER BY users.user_id, reservations.reserved_date_from DESC;
    `;

    const result = await pool.query(query);
    return result.rows;
}


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

module.exports = { getAllUsersReservations, deleteReservations };

