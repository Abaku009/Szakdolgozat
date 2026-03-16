const request = require("supertest");
const app = require("../../app");
const pool = require("../../database/pool/pool");

describe("Order cart recommendation integration test", () => {

    let rockCategory;
    let popCategory;
    let englishLang;
    let storage1;
    let storage2;
    let storage3;
    let cartMusicId;

    beforeEach(async () => {

        await pool.query(`
            TRUNCATE music_order_items,
                     music_orders,
                     music,
                     music_storage,
                     music_language,
                     music_category
            RESTART IDENTITY CASCADE
        `);

        const cat1 = await pool.query(`INSERT INTO music_category (genre) VALUES ('Rock') RETURNING music_category_id`);
        rockCategory = cat1.rows[0].music_category_id;

        const cat2 = await pool.query(`INSERT INTO music_category (genre) VALUES ('Pop') RETURNING music_category_id`);
        popCategory = cat2.rows[0].music_category_id;

        const lang = await pool.query(`INSERT INTO music_language (language) VALUES ('English') RETURNING music_language_id`);
        englishLang = lang.rows[0].music_language_id;

        const s1 = await pool.query(`INSERT INTO music_storage (quantity) VALUES (10) RETURNING music_storage_id`);
        storage1 = s1.rows[0].music_storage_id;

        const s2 = await pool.query(`INSERT INTO music_storage (quantity) VALUES (10) RETURNING music_storage_id`);
        storage2 = s2.rows[0].music_storage_id;

        const s3 = await pool.query(`INSERT INTO music_storage (quantity) VALUES (10) RETURNING music_storage_id`);
        storage3 = s3.rows[0].music_storage_id;

        const cartMusic = await pool.query(`
            INSERT INTO music
            (title, price, format, performer, music_language_id, music_category_id, music_storage_id)
            VALUES ('Rock Song 1','10','digital','Band A',$1,$2,$3)
            RETURNING music_id
        `,[englishLang, rockCategory, storage1]);

        cartMusicId = cartMusic.rows[0].music_id;

        await pool.query(`
            INSERT INTO music
            (title, price, format, performer, music_language_id, music_category_id, music_storage_id)
            VALUES ('Rock Song 2','10','digital','Band A',$1,$2,$3)
        `,[englishLang, rockCategory, storage2]);

        await pool.query(`
            INSERT INTO music
            (title, price, format, performer, music_language_id, music_category_id, music_storage_id)
            VALUES ('Pop Song','10','digital','Artist B',$1,$2,$3)
        `,[englishLang, popCategory, storage3]);

    });

    test("should return music recommendations based on cart", async () => {

        const res = await request(app)
            .post("/api/order_cart_recommendations")
            .send({
                cartMusicIDs: [cartMusicId]
            });

        expect(res.statusCode).toBe(200);
        expect(res.body.length).toBeGreaterThan(0);

        const recommended = res.body.find(m => m.title === "Rock Song 2");
        expect(recommended).toBeDefined();

    });

});

