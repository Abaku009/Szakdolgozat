const request = require("supertest");
const app = require("../../app");
const pool = require("../../database/pool/pool");
const bcrypt = require("bcrypt");

jest.mock("nodemailer", () => {
    return {
        createTransport: jest.fn(() => ({
            sendMail: jest.fn().mockResolvedValue(true)
        }))
    };
});

describe("Reservations integration tests", () => {

    let userId;
    let filmId;
    let filmStorageId;
    let seriesId;
    let seriesStorageId;

    beforeEach(async () => {

        const hashed = await bcrypt.hash("Test123!", 10);

        const user = await pool.query(`
            INSERT INTO users (first_name,last_name,email,hashed_password)
            VALUES ('Reserv','User','reserv@test.com',$1)
            RETURNING user_id
        `,[hashed]);

        userId = user.rows[0].user_id;

        const filmCategory = await pool.query(`INSERT INTO films_category (genre) VALUES ('Action') RETURNING film_category_id`);
        const filmLanguage = await pool.query(`INSERT INTO films_language (language) VALUES ('English') RETURNING film_language_id`);
        const filmStorage = await pool.query(`INSERT INTO films_storage (quantity) VALUES (5) RETURNING film_storage_id`);

        filmStorageId = filmStorage.rows[0].film_storage_id;

        const film = await pool.query(`
            INSERT INTO films
            (title,price,format,film_language_id,film_category_id,film_storage_id,director)
            VALUES ('Test Film','10','DVD',$1,$2,$3,'Test Director')
            RETURNING film_id
        `,[filmLanguage.rows[0].film_language_id,
           filmCategory.rows[0].film_category_id,
           filmStorageId]);

        filmId = film.rows[0].film_id;

        const seriesCategory = await pool.query(`INSERT INTO series_category (genre) VALUES ('Drama') RETURNING series_category_id`);
        const seriesLanguage = await pool.query(`INSERT INTO series_language (language) VALUES ('English') RETURNING series_language_id`);
        const seriesStorage = await pool.query(`INSERT INTO series_storage (quantity) VALUES (5) RETURNING series_storage_id`);

        seriesStorageId = seriesStorage.rows[0].series_storage_id;

        const series = await pool.query(`
            INSERT INTO series
            (title,price,format,series_language_id,series_category_id,series_storage_id,creator)
            VALUES ('Test Series','15','DVD',$1,$2,$3,'Test Creator')
            RETURNING series_id
        `,[seriesLanguage.rows[0].series_language_id,
           seriesCategory.rows[0].series_category_id,
           seriesStorageId]);

        seriesId = series.rows[0].series_id;
    });

    afterEach(async () => {

        await pool.query(`
            TRUNCATE
                reservation_items,
                reservations,
                films,
                films_storage,
                films_category,
                films_language,
                series,
                series_storage,
                series_category,
                series_language,
                users
            RESTART IDENTITY CASCADE
        `);

    });


    test("should create film reservation", async () => {

        const res = await request(app)
            .post("/api/online_reservation")
            .send({
                termekek: [
                    {
                        type: "film",
                        film_id: filmId,
                        film_storage_id: filmStorageId,
                        title: "Test Film",
                        price: 10,
                        qty: 2
                    }
                ],
                user: { user_id: userId, first_name:"Reserv", last_name:"User" },
                teljesAr: 20,
                mode: "online",
                dateFrom: "2025-01-01",
                dateTo: "2025-01-02",
                timeFrom: "10:00",
                timeTo: "12:00"
            });

        expect(res.statusCode).toBe(200);

        const reservations = await pool.query(`SELECT * FROM reservations`);
        expect(reservations.rows.length).toBe(1);

        const items = await pool.query(`SELECT * FROM reservation_items`);
        expect(items.rows.length).toBe(1);
        expect(items.rows[0].film_id).toBe(filmId);

    });


    test("should create series reservation", async () => {

        const res = await request(app)
            .post("/api/on_site_reservation")
            .send({
                termekek: [
                    {
                        type: "series",
                        series_id: seriesId,
                        series_storage_id: seriesStorageId,
                        title: "Test Series",
                        price: 15,
                        qty: 1
                    }
                ],
                user: { user_id: userId, first_name:"Reserv", last_name:"User" },
                teljesAr: 15,
                mode: "on_site",
                dateFrom: "2025-01-01",
                dateTo: "2025-01-03",
                timeFrom: "10:00",
                timeTo: "12:00"
            });

        expect(res.statusCode).toBe(200);

        const items = await pool.query(`SELECT * FROM reservation_items`);
        expect(items.rows[0].series_id).toBe(seriesId);

    });

    test("should create reservation with multiple items", async () => {

        const res = await request(app)
            .post("/api/online_reservation")
            .send({
                termekek: [
                    {
                        type: "film",
                        film_id: filmId,
                        film_storage_id: filmStorageId,
                        title: "Test Film",
                        price: 10,
                        qty: 2
                    },
                    {
                        type: "series",
                        series_id: seriesId,
                        series_storage_id: seriesStorageId,
                        title: "Test Series",
                        price: 15,
                        qty: 1
                    }
                ],
                user: {
                    user_id: userId,
                    first_name: "Reserv",
                    last_name: "User"
                },
                teljesAr: 35,
                mode: "online",
                dateFrom: "2025-01-01",
                dateTo: "2025-01-02",
                timeFrom: "10:00",
                timeTo: "12:00"
            });

        expect(res.statusCode).toBe(200);

        const reservations = await pool.query(`SELECT * FROM reservations`);
        expect(reservations.rows.length).toBe(1);

        const items = await pool.query(`SELECT * FROM reservation_items`);
        expect(items.rows.length).toBe(2);

        const filmStock = await pool.query(
            `SELECT quantity FROM films_storage WHERE film_storage_id = $1`,
            [filmStorageId]
        );

        const seriesStock = await pool.query(
            `SELECT quantity FROM series_storage WHERE series_storage_id = $1`,
            [seriesStorageId]
        );

        expect(filmStock.rows[0].quantity).toBe(3);
        expect(seriesStock.rows[0].quantity).toBe(4);

    });


    test("should fail if stock is insufficient", async () => {

        const res = await request(app)
            .post("/api/online_reservation")
            .send({
                termekek: [
                    {
                        type: "film",
                        film_id: filmId,
                        film_storage_id: filmStorageId,
                        title: "Test Film",
                        price: 10,
                        qty: 10
                    }
                ],
                user: { user_id: userId, first_name:"Reserv", last_name:"User" },
                teljesAr: 100,
                mode: "online",
                dateFrom: "2025-01-01",
                dateTo: "2025-01-02",
                timeFrom: "10:00",
                timeTo: "12:00"
            });

        expect(res.statusCode).toBe(500);

    });

});

