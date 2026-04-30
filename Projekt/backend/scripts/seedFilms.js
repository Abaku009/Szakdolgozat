require("dotenv").config({
    path: ".env.loadtest"
});

const pool = require("../database/pool/pool");

async function seedFilms() {

    console.log("Seeding film data...");

    await pool.query(`
        TRUNCATE
            reservation_items,
            reservations,
            films,
            films_storage,
            films_language,
            films_category
        RESTART IDENTITY CASCADE
    `);

    const categories = [];
    const languages = [];
    const storages = [];

    
    for (let i = 0; i < 10; i++) {
        const res = await pool.query(
            `INSERT INTO films_category (genre) VALUES ($1) RETURNING film_category_id`,
            [`Genre_${i}`]
        );
        categories.push(res.rows[0].film_category_id);
    }

    
    for (let i = 0; i < 5; i++) {
        const res = await pool.query(
            `INSERT INTO films_language (language) VALUES ($1) RETURNING film_language_id`,
            [`Lang_${i}`]
        );
        languages.push(res.rows[0].film_language_id);
    }

    
    for (let i = 0; i < 50; i++) {
        const res = await pool.query(
            `INSERT INTO films_storage (quantity) VALUES (100) RETURNING film_storage_id`
        );
        storages.push(res.rows[0].film_storage_id);
    }

    
    for (let i = 0; i < 1000; i++) {

        const storageId = storages[i % storages.length];

        await pool.query(`
            INSERT INTO films
            (title, price, format, film_language_id, film_category_id, film_storage_id, director)
            VALUES ($1,$2,$3,$4,$5,$6,$7)
        `,
        [
            `Film_${i}`,
            "10",
            i % 2 === 0 ? "HD" : "4K",
            languages[i % languages.length],
            categories[i % categories.length],
            storageId,
            `Director_${i % 20}`
        ]);
    }

    console.log("Film seeding kész (1000 rekord)");

    process.exit();
}

seedFilms();

