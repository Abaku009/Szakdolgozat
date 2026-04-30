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

    const films = await pool.query(`
        SELECT film_id FROM films LIMIT 20
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

            const filmId = films.rows[(i + j) % films.rows.length].film_id;

            await pool.query(`
                INSERT INTO reservation_items (reservation_id, film_id, quantity)
                VALUES ($1,$2,1)
            `, [reservationId, filmId]);
        }
    }

    return userId;
}

async function runLoadTest() {

    console.log("Film load test indul...");

    await pool.query(`
        TRUNCATE users, reservations, reservation_items RESTART IDENTITY CASCADE;
    `);

    const userId = await createTestUserWithReservations();

    const CONCURRENT_REQUESTS = 50;

    const requests = [];

    for (let i = 0; i < CONCURRENT_REQUESTS; i++) {
        requests.push(
            request(app)
                .post("/api/film_recommendations")
                .send({ userID: userId })
        );
    }

    console.time("Film válaszidő");

    const responses = await Promise.all(requests);

    console.timeEnd("Film válaszidő");

    const success = responses.filter(r => r.statusCode === 200).length;
    const failed = responses.length - success;

    console.log(`Sikeres: ${success}`);
    console.log(`Hibás: ${failed}`);

    process.exit();
}

runLoadTest();

