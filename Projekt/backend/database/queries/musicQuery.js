const pool = require("../pool/pool");

async function getAllMusic() {
  const { rows } = await pool.query(`
    SELECT 
      music.music_id,
      music.title,
      music.performer,
      music.price,
      music.format,
      music_category.genre AS categoryname,
      music_language.language AS languagename,
      music_storage.quantity AS stock,
      music.music_storage_id
    FROM music
    JOIN music_category ON music.music_category_id = music_category.music_category_id
    JOIN music_language ON music.music_language_id = music_language.music_language_id
    JOIN music_storage ON music.music_storage_id = music_storage.music_storage_id
    ORDER BY music.title
  `);
  return rows;
}

async function getMusicGenres() {
  const { rows } = await pool.query(`SELECT genre FROM music_category ORDER BY genre`);
  return rows;
}

async function getMusicLanguages() {
  const { rows } = await pool.query(`SELECT language FROM music_language ORDER BY language`);
  return rows;
}

async function getMusicFormats() {
  const { rows } = await pool.query(`SELECT DISTINCT format FROM music ORDER BY format`);
  return rows;
}

module.exports = { getAllMusic, getMusicGenres, getMusicLanguages, getMusicFormats };

