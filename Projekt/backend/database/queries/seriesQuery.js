const pool = require("../pool/pool");

async function getAllSeries() {
    const { rows } = await pool.query(`
        SELECT
            series.series_id,
            series.title,
            series.price,
            series.format,
            series_category.genre AS categoryname,
            series_language.language AS languagename,
            series_storage.quantity AS stock
        FROM series
        JOIN series_category ON series.series_category_id = series_category.series_category_id
        JOIN series_language ON series.series_language_id = series_language.series_language_id
        JOIN series_storage ON series.series_storage_id = series_storage.series_storage_id
        ORDER BY series.title
    `);
    return rows;
}

async function getSeriesGenres() {
    const { rows } = await pool.query(`SELECT genre FROM series_category ORDER BY genre`);
    return rows; 
}

async function getSeriesLanguages() {
    const { rows } = await pool.query(`SELECT language FROM series_language ORDER BY language`);
    return rows;
}

async function getSeriesFormats() {
    const { rows } = await pool.query(`SELECT DISTINCT format FROM series ORDER BY format`);
    return rows;
}

module.exports = { getAllSeries, getSeriesGenres, getSeriesLanguages, getSeriesFormats };

