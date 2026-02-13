const pool = require("../pool/pool");


const weights = {
    genre: 7,
    director: 3,
    language: 2
};


async function filmRecommendations(userID) {
    if (!userID) return [];

    const { rows: reservationData } = await pool.query(`
        SELECT 
            films.film_id,
            films.film_category_id,
            films.film_language_id,
            films.director,
            reservations.reserved_date_from
        FROM reservations
        JOIN reservation_items ON reservations.reservation_id = reservation_items.reservation_id
        JOIN films ON reservation_items.film_id = films.film_id
        WHERE reservations.user_id = $1
        `, 
        [userID]
    );

    if (reservationData.length === 0) return [];

    const genres = {};
    const directors = {};
    const languages = {};

    const today = new Date();
    const lambda = 0.01; 

    reservationData.forEach(item => {
        const reservationDate = new Date(item.reserved_date_from);
        const daysDifference = Math.max(0, (today - reservationDate) / (1000 * 60 * 60 * 24));

        const timeWeight = Math.exp(-lambda * daysDifference);

        genres[item.film_category_id] = (genres[item.film_category_id] || 0) + timeWeight;
        languages[item.film_language_id] = (languages[item.film_language_id] || 0) + timeWeight;
        directors[item.director] = (directors[item.director] || 0) + timeWeight;
    });

    const { rows: recommendable } = await pool.query(`
        SELECT 
            films.film_id,
            films.title,
            films.price,
            films.format,
            films.film_category_id,
            films.film_language_id,
            films_category.genre AS categoryname,
            films_language.language AS languagename,
            films_storage.quantity AS stock,
            films.film_storage_id,
            films.is_active,
            films.director
        FROM films
        JOIN films_category ON films.film_category_id = films_category.film_category_id
        JOIN films_language ON films.film_language_id = films_language.film_language_id
        JOIN films_storage ON films.film_storage_id = films_storage.film_storage_id
        WHERE films.is_active = true
        AND films_storage.quantity > 0
        AND films.film_id NOT IN (
            SELECT reservation_items.film_id
            FROM reservations
            JOIN reservation_items ON reservations.reservation_id = reservation_items.reservation_id
            WHERE reservations.user_id = $1
            AND reservation_items.film_id IS NOT NULL
        )
        `,
        [userID]
    );

    const scored = recommendable.map(film => {
        let score = 0;

        if (genres[film.film_category_id]) score += weights.genre * genres[film.film_category_id];
        if (directors[film.director]) score += weights.director * directors[film.director];
        if (languages[film.film_language_id]) score += weights.language * languages[film.film_language_id];

        return { ...film, score };
    });

    return scored
        .filter(f => f.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, 3);
    
};


module.exports = { filmRecommendations };

