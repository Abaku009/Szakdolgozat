require("dotenv").config({
    path: ".env.loadtest"
});

const request = require("supertest");
const app = require("../app");
const pool = require("../database/pool/pool");
const bcrypt = require("bcrypt");

async function createTestUserWithReservations() {

    const hashed = await bcrypt.hash("Test123!", 10);

    const user = await pool.query(`
        INSERT INTO users (first_name, last_name, email, hashed_password)
        VALUES ('Load','Test','load@test.com',$1)
        RETURNING user_id
    `, [hashed]);

    const userId = user.rows[0].user_id;

    const series = await pool.query(`
        SELECT series_id FROM series LIMIT 20
    `);

    for (let i = 0; i < 5; i++) {

        const daysOffset = i * 3;

        const date = new Date();
        date.setDate(date.getDate() - daysOffset);

        const dateStr = date.toISOString().split("T")[0];

        const reservation = await pool.query(`
            INSERT INTO reservations
            (user_id, mode, reserved_date_from, reserved_date_to, reserved_from, reserved_to)
            VALUES ($1, 'online', $2, $2, '10:00', '12:00')
            RETURNING reservation_id
        `, [userId, dateStr]);

        const reservationId = reservation.rows[0].reservation_id;

        for (let j = 0; j < 3; j++) {

            const seriesId = series.rows[(i + j) % series.rows.length].series_id;

            await pool.query(`
                INSERT INTO reservation_items (reservation_id, series_id, quantity)
                VALUES ($1,$2,1)
            `, [reservationId, seriesId]);
        }
    }

    return userId;
}

async function runLoadTest() {

    console.log("Series load test indul...");

    await pool.query(`
        TRUNCATE users, reservations, reservation_items RESTART IDENTITY CASCADE;
    `);

    const userId = await createTestUserWithReservations();

    const CONCURRENT_REQUESTS = 50;

    const requests = [];

    for (let i = 0; i < CONCURRENT_REQUESTS; i++) {
        requests.push(
            request(app)
                .post("/api/series_recommendations")
                .send({ userID: userId })
        );
    }

    console.time("Series válaszidő");

    const responses = await Promise.all(requests);

    console.timeEnd("Series válaszidő");

    const success = responses.filter(r => r.statusCode === 200).length;
    const failed = responses.length - success;

    console.log(`Sikeres: ${success}`);
    console.log(`Hibás: ${failed}`);

    process.exit();
}

runLoadTest();

