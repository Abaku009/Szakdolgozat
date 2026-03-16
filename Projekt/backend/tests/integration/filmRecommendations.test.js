const request = require("supertest");
const app = require("../../app");
const pool = require("../../database/pool/pool");

describe("Film recommendation integration test", () => {

    let userId;
    let catAction;
    let catDrama;
    let langEN;
    let storage1;
    let storage2;
    let reservedFilmId;

    beforeEach(async () => {

        await pool.query(`
            TRUNCATE
                reservation_items,
                reservations,
                films,
                films_storage,
                films_language,
                films_category,
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
            INSERT INTO films_category (genre)
            VALUES ('Action')
            RETURNING film_category_id
        `);
        catAction = cat1.rows[0].film_category_id;

        const cat2 = await pool.query(`
            INSERT INTO films_category (genre)
            VALUES ('Drama')
            RETURNING film_category_id
        `);
        catDrama = cat2.rows[0].film_category_id;

        const lang = await pool.query(`
            INSERT INTO films_language (language)
            VALUES ('English')
            RETURNING film_language_id
        `);
        langEN = lang.rows[0].film_language_id;

        const s1 = await pool.query(`INSERT INTO films_storage (quantity) VALUES (10) RETURNING film_storage_id`);
        storage1 = s1.rows[0].film_storage_id;

        const s2 = await pool.query(`INSERT INTO films_storage (quantity) VALUES (10) RETURNING film_storage_id`);
        storage2 = s2.rows[0].film_storage_id;

        const reservedFilm = await pool.query(`
            INSERT INTO films
            (title,price,format,film_language_id,film_category_id,film_storage_id,director)
            VALUES ('Action Movie 1','10','digital',$1,$2,$3,'Director A')
            RETURNING film_id
        `, [langEN, catAction, storage1]);

        reservedFilmId = reservedFilm.rows[0].film_id;

        await pool.query(`
            INSERT INTO films
            (title,price,format,film_language_id,film_category_id,film_storage_id,director)
            VALUES ('Action Movie 2','10','digital',$1,$2,$3,'Director A')
        `,[langEN, catAction, storage2]);

        const reservation = await pool.query(`
            INSERT INTO reservations (user_id, mode, reserved_date_from, reserved_date_to, reserved_from, reserved_to)
            VALUES ($1,'online','2026-03-16','2026-03-20','10:00','12:00')
            RETURNING reservation_id
        `,[userId]);

        const reservationId = reservation.rows[0].reservation_id;

        await pool.query(`
            INSERT INTO reservation_items (reservation_id, film_id, quantity)
            VALUES ($1,$2,1)
        `,[reservationId,reservedFilmId]);

    });

    test("should recommend films based on user reservation history", async () => {

        const res = await request(app)
            .post("/api/film_recommendations")
            .send({
                userID: userId
            });

        expect(res.statusCode).toBe(200);
        expect(res.body.length).toBeGreaterThan(0);

        const recommended = res.body.find(f => f.title === "Action Movie 2");
        expect(recommended).toBeDefined();

    });

});

