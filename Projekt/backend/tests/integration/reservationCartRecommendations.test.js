const request = require("supertest");
const app = require("../../app");
const pool = require("../../database/pool/pool");

describe("Reservation cart recommendation integration test", () => {

    let filmCategory;
    let seriesCategory;
    let language;
    let filmStorage1;
    let filmStorage2;
    let seriesStorage1;
    let seriesStorage2;
    let cartFilmId;
    let cartSeriesId;

    beforeEach(async () => {

        await pool.query(`
            TRUNCATE
                reservation_items,
                reservations,
                films,
                films_storage,
                films_language,
                films_category,
                series,
                series_storage,
                series_language,
                series_category
            RESTART IDENTITY CASCADE
        `);

        const filmCat = await pool.query(`
            INSERT INTO films_category (genre)
            VALUES ('Action')
            RETURNING film_category_id
        `);
        filmCategory = filmCat.rows[0].film_category_id;

        const seriesCat = await pool.query(`
            INSERT INTO series_category (genre)
            VALUES ('Action')
            RETURNING series_category_id
        `);
        seriesCategory = seriesCat.rows[0].series_category_id;

        const lang = await pool.query(`
            INSERT INTO films_language (language)
            VALUES ('English')
            RETURNING film_language_id
        `);
        language = lang.rows[0].film_language_id;

        const seriesLang = await pool.query(`
            INSERT INTO series_language (language)
            VALUES ('English')
            RETURNING series_language_id
        `);
        const seriesLanguage = seriesLang.rows[0].series_language_id;

        const fs1 = await pool.query(`
            INSERT INTO films_storage (quantity)
            VALUES (10)
            RETURNING film_storage_id
        `);
        filmStorage1 = fs1.rows[0].film_storage_id;

        const fs2 = await pool.query(`
            INSERT INTO films_storage (quantity)
            VALUES (10)
            RETURNING film_storage_id
        `);
        filmStorage2 = fs2.rows[0].film_storage_id;

        const ss1 = await pool.query(`
            INSERT INTO series_storage (quantity)
            VALUES (10)
            RETURNING series_storage_id
        `);
        seriesStorage1 = ss1.rows[0].series_storage_id;

        const ss2 = await pool.query(`
            INSERT INTO series_storage (quantity)
            VALUES (10)
            RETURNING series_storage_id
        `);
        seriesStorage2 = ss2.rows[0].series_storage_id;

        const cartFilm = await pool.query(`
            INSERT INTO films
            (title, price, format, film_language_id, film_category_id, film_storage_id, director)
            VALUES ('Test Film','10','dvd',$1,$2,$3,'Director A')
            RETURNING film_id
        `,[language, filmCategory, filmStorage1]);

        cartFilmId = cartFilm.rows[0].film_id;

        await pool.query(`
            INSERT INTO films
            (title, price, format, film_language_id, film_category_id, film_storage_id, director)
            VALUES ('Recommended Film','10','dvd',$1,$2,$3,'Director A')
        `,[language, filmCategory, filmStorage2]);

        const cartSeries = await pool.query(`
            INSERT INTO series
            (title, price, format, series_language_id, series_category_id, series_storage_id, creator)
            VALUES ('Test Series','10','dvd',$1,$2,$3,'Creator A')
            RETURNING series_id
        `,[seriesLanguage, seriesCategory, seriesStorage1]);

        cartSeriesId = cartSeries.rows[0].series_id;

        await pool.query(`
            INSERT INTO series
            (title, price, format, series_language_id, series_category_id, series_storage_id, creator)
            VALUES ('Recommended Series','10','dvd',$1,$2,$3,'Creator A')
        `,[seriesLanguage, seriesCategory, seriesStorage2]);

    });

    test("should return film and series recommendations based on cart", async () => {

        const res = await request(app)
            .post("/api/reservation_cart_recommendations")
            .send({
                cartIDs: [
                    { type: "film", id: cartFilmId },
                    { type: "series", id: cartSeriesId }
                ]
            });

        expect(res.statusCode).toBe(200);
        expect(res.body.length).toBeGreaterThan(0);

        const filmRecommendation = res.body.find(i => i.title === "Recommended Film");
        const seriesRecommendation = res.body.find(i => i.title === "Recommended Series");

        expect(filmRecommendation).toBeDefined();
        expect(seriesRecommendation).toBeDefined();

    });

});

