require("dotenv").config({
    path: ".env.loadtest"
});

const pool = require("../database/pool/pool");

async function seedMusic() {

    console.log("Seeding music data...");

    await pool.query(`
        TRUNCATE 
            music_order_items,
            music_orders,
            music,
            music_storage,
            music_language,
            music_category
        RESTART IDENTITY CASCADE
    `);

    const categories = [];
    const languages = [];
    const storages = [];


    for (let i = 0; i < 10; i++) {
        const res = await pool.query(
            `INSERT INTO music_category (genre) VALUES ($1) RETURNING music_category_id`,
            [`Genre_${i}`]
        );
        categories.push(res.rows[0].music_category_id);
    }


    for (let i = 0; i < 5; i++) {
        const res = await pool.query(
            `INSERT INTO music_language (language) VALUES ($1) RETURNING music_language_id`,
            [`Lang_${i}`]
        );
        languages.push(res.rows[0].music_language_id);
    }


    for (let i = 0; i < 50; i++) {
        const res = await pool.query(
            `INSERT INTO music_storage (quantity) VALUES (100) RETURNING music_storage_id`
        );
        storages.push(res.rows[0].music_storage_id);
    }


    for (let i = 0; i < 1000; i++) {

        const storageId = storages[i % storages.length];

        await pool.query(`
            INSERT INTO music
            (title, price, format, performer, music_language_id, music_category_id, music_storage_id)
            VALUES ($1,$2,$3,$4,$5,$6,$7)
        `,
        [
            `Song_${i}`,
            "10",
            "digital",
            `Artist_${i % 20}`,
            languages[i % languages.length],
            categories[i % categories.length],
            storageId
        ]);
    }

    console.log("Music seeding kész (1000 rekord)");

    process.exit();
}

seedMusic();

