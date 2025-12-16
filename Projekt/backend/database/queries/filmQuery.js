const pool = require("../pool/pool");

async function getAllFilms() {
    const { rows } = await pool.query(`
        SELECT
            films.film_id,
            films.title,
            films.price,
            films.format,
            films_category.genre AS categoryname,
            films_language.language AS languagename,
            films_storage.quantity AS stock,
            films.film_storage_id
        FROM films
        JOIN films_category ON films.film_category_id = films_category.film_category_id
        JOIN films_language ON films.film_language_id = films_language.film_language_id
        JOIN films_storage ON films.film_storage_id = films_storage.film_storage_id
        ORDER BY films.title  
    `);
    return rows;
}

async function getFilmGenres() {
    const { rows } = await pool.query(`SELECT genre FROM films_category ORDER BY genre`);
    return rows;
}

async function getFilmLanguages() {
    const { rows } = await pool.query(`SELECT language FROM films_language ORDER BY language`);
    return rows;
}

async function getFilmFormats() {
    const { rows } = await pool.query(`SELECT DISTINCT format FROM films ORDER BY format`);
    return rows;
}

module.exports = { getAllFilms, getFilmGenres, getFilmLanguages, getFilmFormats };

