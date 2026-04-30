require("dotenv").config({
    path: ".env.loadtest"
});

const pool = require("../database/pool/pool");

async function seedSeries() {

    console.log("Seeding series data...");

    await pool.query(`
        TRUNCATE
            reservation_items,
            reservations,
            series,
            series_storage,
            series_language,
            series_category
        RESTART IDENTITY CASCADE
    `);

    const categories = [];
    const languages = [];
    const storages = [];

    
    for (let i = 0; i < 10; i++) {
        const res = await pool.query(
            `INSERT INTO series_category (genre) VALUES ($1) RETURNING series_category_id`,
            [`Genre_${i}`]
        );
        categories.push(res.rows[0].series_category_id);
    }

    
    for (let i = 0; i < 5; i++) {
        const res = await pool.query(
            `INSERT INTO series_language (language) VALUES ($1) RETURNING series_language_id`,
            [`Lang_${i}`]
        );
        languages.push(res.rows[0].series_language_id);
    }

    
    for (let i = 0; i < 50; i++) {
        const res = await pool.query(
            `INSERT INTO series_storage (quantity) VALUES (100) RETURNING series_storage_id`
        );
        storages.push(res.rows[0].series_storage_id);
    }

    
    for (let i = 0; i < 1000; i++) {

        const storageId = storages[i % storages.length];

        await pool.query(`
            INSERT INTO series
            (title, price, format, series_language_id, series_category_id, series_storage_id, creator)
            VALUES ($1,$2,$3,$4,$5,$6,$7)
        `,
        [
            `Series_${i}`,
            "10",
            i % 2 === 0 ? "HD" : "4K",
            languages[i % languages.length],
            categories[i % categories.length],
            storageId,
            `Creator_${i % 20}`
        ]);
    }

    console.log("Series seeding kész (1000 rekord)");

    process.exit();
}

seedSeries();

