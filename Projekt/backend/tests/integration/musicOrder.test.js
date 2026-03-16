jest.mock('nodemailer', () => {
    return {
        createTransport: jest.fn(() => ({
            sendMail: jest.fn().mockResolvedValue(true)
        }))
    };
});


const request = require("supertest");
const app = require("../../app");
const pool = require("../../database/pool/pool");
const bcrypt = require("bcrypt");


describe("Music order integration test", () => {

    let userId;
    let musicId;
    let storageId;

    beforeEach(async () => {

        const hashed = await bcrypt.hash("Test123!", 10);

        const user = await pool.query(`
            INSERT INTO users (first_name, last_name, email, hashed_password, is_admin)
            VALUES ('Order','Test','order@test.com',$1,false)
            RETURNING user_id
        `,[hashed]);

        userId = user.rows[0].user_id;

        const category = await pool.query(`INSERT INTO music_category (genre) VALUES ('Rock') RETURNING music_category_id`);
        const categoryId = category.rows[0].music_category_id;

        const language = await pool.query(`INSERT INTO music_language (language) VALUES ('English') RETURNING music_language_id`);
        const languageId = language.rows[0].music_language_id;

        const storage = await pool.query(`INSERT INTO music_storage (quantity) VALUES (10) RETURNING music_storage_id`);
        storageId = storage.rows[0].music_storage_id;

        const music = await pool.query(`
            INSERT INTO music
            (title, price, format, performer, music_language_id, music_category_id, music_storage_id)
            VALUES ($1,$2,$3,$4,$5,$6,$7)
            RETURNING music_id
        `,
        [
            "Test Song",
            "10",
            "digital",
            "Test Band",
            languageId,
            categoryId,
            storageId
        ]);

        musicId = music.rows[0].music_id;

    });


    afterEach(async () => {
        await pool.query(`
            TRUNCATE music_order_items,
                 music_orders,
                 music,
                 music_storage,
                 music_language,
                 music_category,
                 users
            RESTART IDENTITY CASCADE
        `);

    });


    test("should create music order", async () => {

        const res = await request(app)
            .post("/api/music_order")
            .send({
                music: [
                    {
                        music_id: musicId,
                        music_storage_id: storageId,
                        title: "Test Song",
                        price: 10,
                        qty: 2
                    }
                ],
                user: {
                    user_id: userId,
                    first_name: "Order",
                    last_name: "Test"
                },
                teljesAr: 20
            });

        expect(res.statusCode).toBe(200);

        const orders = await pool.query(`SELECT * FROM music_orders`);
        expect(orders.rows.length).toBe(1);

        const items = await pool.query(`SELECT * FROM music_order_items`);
        expect(items.rows.length).toBe(1);
        expect(items.rows[0].music_id).toBe(musicId);
        expect(items.rows[0].quantity).toBe(2);

        const stock = await pool.query(`
            SELECT quantity FROM music_storage WHERE music_storage_id = $1
        `, [storageId]);

        expect(stock.rows[0].quantity).toBe(8);

    });

});

