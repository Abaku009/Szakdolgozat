const pool = require("../pool/pool");

async function getAllFilms(showInactive = false) {
    let query = `
        SELECT
            films.film_id,
            films.title,
            films.price,
            films.format,
            films_category.genre AS categoryname,
            films_language.language AS languagename,
            films_storage.quantity AS stock,
            films.film_storage_id,
            films.is_active
        FROM films
        JOIN films_category ON films.film_category_id = films_category.film_category_id
        JOIN films_language ON films.film_language_id = films_language.film_language_id
        JOIN films_storage ON films.film_storage_id = films_storage.film_storage_id
    `;

    if (!showInactive) { 
        query += " WHERE films.is_active = true";
    }
    
    query += " ORDER BY films.title";
    
    const { rows } = await pool.query(query);
    return rows;
}

async function getFilmGenres() {
    const { rows } = await pool.query(`
        SELECT film_category_id, genre 
        FROM films_category 
        ORDER BY genre
    `);
    return rows;
}

async function getFilmLanguages() {
    const { rows } = await pool.query(`
        SELECT film_language_id, language 
        FROM films_language 
        ORDER BY language
    `);
    return rows;
}

async function getFilmFormats() {
    const { rows } = await pool.query(`SELECT DISTINCT format FROM films ORDER BY format`);
    return rows;
}

module.exports = { getAllFilms, getFilmGenres, getFilmLanguages, getFilmFormats };

