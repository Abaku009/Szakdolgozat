const pool = require("../pool/pool");


const weights = {
    genre: 5,
    director_creator: 3,
    language: 2
};


async function reservationCartRecommendations(cartIDs) {
    if(!cartIDs || cartIDs.length === 0) return [];


    const filmsInCart = cartIDs.filter(item => item.type === "film").map(item => item.id);
    const seriesInCart = cartIDs.filter(item => item.type === "series").map(item => item.id);


    const recommendations = [];


    if(filmsInCart.length > 0) {
        const { rows: cartFilmsData } = await pool.query(`
            SELECT film_id, film_category_id, film_language_id, director
            FROM films
            WHERE film_id = ANY($1)
            `,
            [filmsInCart]
        );

        const filmGenres = {};
        const filmLanguages = {};
        const filmDirectors = {};

        cartFilmsData.forEach(film => {
            filmGenres[film.film_category_id] = (filmGenres[film.film_category_id] || 0) + 1;
            filmLanguages[film.film_language_id] =(filmLanguages[film.film_language_id] || 0) + 1;
            filmDirectors[film.director] = (filmDirectors[film.director] || 0) + 1;
        });

        const { rows: filmRecommendable } = await pool.query(`
            SELECT
                films.film_id AS id,
                films.film_id AS film_id,
                'film' AS type,
                films.title,
                films.price,
                films.format,
                films.director,
                films.film_category_id,
                films.film_language_id,
                films_category.genre AS categoryname,
                films_language.language AS languagename,
                films_storage.quantity AS stock,
                films.film_storage_id,
                films.is_active
            FROM films
            JOIN films_category ON films.film_category_id = films_category.film_category_id
            JOIN films_language ON films.film_language_id = films_language.film_language_id
            JOIN films_storage ON films.film_storage_id = films_storage.film_storage_id
            WHERE films.is_active = true
            AND films_storage.quantity > 0
            AND films.film_id != ALL($1)
            `,
            [filmsInCart]
        );

        filmRecommendable.forEach(film => {
            let score = 0;
            if(filmGenres[film.film_category_id]) score += weights.genre * filmGenres[film.film_category_id];
            if(filmDirectors[film.director]) score += weights.director_creator * filmDirectors[film.director];
            if(filmLanguages[film.film_language_id]) score += weights.language * filmLanguages[film.film_language_id];

            if(score > 0) recommendations.push({ ...film, score });
        });
    }


    if(seriesInCart.length > 0) {
        const { rows: cartSeriesData } = await pool.query(`
            SELECT series_id, series_category_id, series_language_id, creator
            FROM series
            WHERE series_id = ANY($1)
            `,
            [seriesInCart]
        );

        const seriesGenres = {};
        const seriesLanguages = {};
        const seriesCreators = {};

        cartSeriesData.forEach(serie => {
            seriesGenres[serie.series_category_id] = (seriesGenres[serie.series_category_id] || 0) + 1;
            seriesLanguages[serie.series_language_id] =(seriesLanguages[serie.series_language_id] || 0) + 1;
            seriesCreators[serie.creator] = (seriesCreators[serie.creator] || 0) + 1;
        });

        const { rows: seriesRecommendable } = await pool.query(`
            SELECT
                series.series_id AS id,
                series.series_id AS series_id,
                'series' AS type,
                series.title,
                series.price,
                series.format,
                series.creator,
                series.series_category_id,
                series.series_language_id,
                series_category.genre AS categoryname,
                series_language.language AS languagename,
                series_storage.quantity AS stock,
                series.series_storage_id,
                series.is_active
            FROM series
            JOIN series_category ON series.series_category_id = series_category.series_category_id
            JOIN series_language ON series.series_language_id = series_language.series_language_id
            JOIN series_storage ON series.series_storage_id = series_storage.series_storage_id
            WHERE series.is_active = true
            AND series_storage.quantity > 0
            AND series.series_id != ALL($1)
            `,
            [seriesInCart]
        );

        seriesRecommendable.forEach(serie => {
            let score = 0;
            if(seriesGenres[serie.series_category_id]) score += weights.genre * seriesGenres[serie.series_category_id];
            if(seriesCreators[serie.creator]) score += weights.director_creator * seriesCreators[serie.creator];
            if(seriesLanguages[serie.series_language_id]) score += weights.language * seriesLanguages[serie.series_language_id];

            if(score > 0) recommendations.push({ ...serie, score });
        });
    }


    return recommendations
        .sort((a, b) => b.score - a.score)
        .slice(0, 4);

    
};

module.exports = { reservationCartRecommendations };

