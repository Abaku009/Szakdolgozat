const pool = require("../pool/pool");

async function getOwnReservations(userId) {
    const query = `
        SELECT
            reservations.reservation_id AS reservation_id,
            reservations.mode,
            to_char(reservations.reserved_date_from, 'YYYY-MM-DD') AS reserved_date_from,
            to_char(reservations.reserved_date_to, 'YYYY-MM-DD') AS reserved_date_to,
            reservations.reserved_from,
            reservations.reserved_to,

            reservation_items.quantity,

            films.title AS film_title,
            series.title AS series_title

        FROM reservations

        INNER JOIN reservation_items
            ON reservation_items.reservation_id = reservations.reservation_id

        LEFT JOIN films
            ON reservation_items.film_id = films.film_id

        LEFT JOIN series
            ON reservation_items.series_id = series.series_id

        WHERE reservations.user_id = $1

        ORDER BY reservations.reserved_date_from DESC;
    `;

    const queryResult = await pool.query(query, [userId]);

    return queryResult.rows;
}

module.exports = { getOwnReservations };

