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

module.exports = { getAllUsersReservations };

