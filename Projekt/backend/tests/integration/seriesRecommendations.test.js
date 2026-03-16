const request = require("supertest");
const app = require("../../app");
const pool = require("../../database/pool/pool");

describe("Series recommendation integration test", () => {

    let userId;
    let catAction;
    let catDrama;
    let langEN;
    let storage1;
    let storage2;
    let reservedSeriesId;

    beforeEach(async () => {

        await pool.query(`
            TRUNCATE
                reservation_items,
                reservations,
                series,
                series_storage,
                series_language,
                series_category,
                users
            RESTART IDENTITY CASCADE
        `);

        const user = await pool.query(`
            INSERT INTO users (first_name,last_name,email,hashed_password)
            VALUES ('Test','User','test@test.com','hash')
            RETURNING user_id
        `);

        userId = user.rows[0].user_id;

        const cat1 = await pool.query(`
            INSERT INTO series_category (genre)
            VALUES ('Action')
            RETURNING series_category_id
        `);
        catAction = cat1.rows[0].series_category_id;

        const cat2 = await pool.query(`
            INSERT INTO series_category (genre)
            VALUES ('Drama')
            RETURNING series_category_id
        `);
        catDrama = cat2.rows[0].series_category_id;

        const lang = await pool.query(`
            INSERT INTO series_language (language)
            VALUES ('English')
            RETURNING series_language_id
        `);
        langEN = lang.rows[0].series_language_id;

        const s1 = await pool.query(`INSERT INTO series_storage (quantity) VALUES (10) RETURNING series_storage_id`);
        storage1 = s1.rows[0].series_storage_id;

        const s2 = await pool.query(`INSERT INTO series_storage (quantity) VALUES (10) RETURNING series_storage_id`);
        storage2 = s2.rows[0].series_storage_id;

        const reservedSeries = await pool.query(`
            INSERT INTO series
            (title,price,format,series_language_id,series_category_id,series_storage_id,creator)
            VALUES ('Action Series 1','10','digital',$1,$2,$3,'Creator A')
            RETURNING series_id
        `, [langEN, catAction, storage1]);

        reservedSeriesId = reservedSeries.rows[0].series_id;

        await pool.query(`
            INSERT INTO series
            (title,price,format,series_language_id,series_category_id,series_storage_id,creator)
            VALUES ('Action Series 2','10','digital',$1,$2,$3,'Creator A')
        `,[langEN, catAction, storage2]);

        const reservation = await pool.query(`
            INSERT INTO reservations (user_id, mode, reserved_date_from, reserved_date_to, reserved_from, reserved_to)
            VALUES ($1,'online','2026-03-16','2026-03-20','10:00','12:00')
            RETURNING reservation_id
        `,[userId]);

        const reservationId = reservation.rows[0].reservation_id;

        await pool.query(`
            INSERT INTO reservation_items (reservation_id, series_id, quantity)
            VALUES ($1,$2,1)
        `,[reservationId,reservedSeriesId]);

    });

    test("should recommend series based on user reservation history", async () => {

        const res = await request(app)
            .post("/api/series_recommendations")
            .send({
                userID: userId
            });

        expect(res.statusCode).toBe(200);
        expect(res.body.length).toBeGreaterThan(0);

        const recommended = res.body.find(s => s.title === "Action Series 2");
        expect(recommended).toBeDefined();

    });

});

