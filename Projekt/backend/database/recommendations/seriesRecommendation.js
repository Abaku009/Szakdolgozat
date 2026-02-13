const pool = require("../pool/pool");


const weights = {
    genre: 7,
    creator: 3,
    language: 2
};


async function seriesRecommendations(userID) {
    if (!userID) return [];

    const { rows: reservationData } = await pool.query(`
        SELECT 
            series.series_id,
            series.series_category_id,
            series.series_language_id,
            series.creator,
            reservations.reserved_date_from
        FROM reservations
        JOIN reservation_items ON reservations.reservation_id = reservation_items.reservation_id
        JOIN series ON reservation_items.series_id = series.series_id
        WHERE reservations.user_id = $1
        `, 
        [userID]
    );

    if (reservationData.length === 0) return [];

    const genres = {};
    const creators = {};
    const languages = {};

    const today = new Date();
    const lambda = 0.01; 

    reservationData.forEach(item => {
        const reservationDate = new Date(item.reserved_date_from);
        const daysDifference = Math.max(0, (today - reservationDate) / (1000 * 60 * 60 * 24));

        const timeWeight = Math.exp(-lambda * daysDifference);

        genres[item.series_category_id] = (genres[item.series_category_id] || 0) + timeWeight;
        languages[item.series_language_id] = (languages[item.series_language_id] || 0) + timeWeight;
        creators[item.creator] = (creators[item.creator] || 0) + timeWeight;
    });

    const { rows: recommendable } = await pool.query(`
        SELECT 
            series.series_id,
            series.title,
            series.price,
            series.format,
            series.series_category_id,
            series.series_language_id,
            series_category.genre AS categoryname,
            series_language.language AS languagename,
            series_storage.quantity AS stock,
            series.series_storage_id,
            series.is_active,
            series.creator
        FROM series
        JOIN series_category ON series.series_category_id = series_category.series_category_id
        JOIN series_language ON series.series_language_id = series_language.series_language_id
        JOIN series_storage ON series.series_storage_id = series_storage.series_storage_id
        WHERE series.is_active = true
        AND series_storage.quantity > 0
        AND series.series_id NOT IN (
            SELECT reservation_items.series_id
            FROM reservations
            JOIN reservation_items ON reservations.reservation_id = reservation_items.reservation_id
            WHERE reservations.user_id = $1
            AND reservation_items.series_id IS NOT NULL
        )
        `,
        [userID]
    );

    const scored = recommendable.map(serie => {
        let score = 0;

        if (genres[serie.series_category_id]) score += weights.genre * genres[serie.series_category_id];
        if (creators[serie.creator]) score += weights.creator * creators[serie.creator];
        if (languages[serie.series_language_id]) score += weights.language * languages[serie.series_language_id];

        return { ...serie, score };
    });

    return scored
        .filter(s => s.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, 3);
    
};


module.exports = { seriesRecommendations };

