require("dotenv").config({
    path: ".env.loadtest"
});

const request = require("supertest");
const app = require("../app");
const pool = require("../database/pool/pool");
const bcrypt = require("bcrypt");

async function createTestUserWithOrders() {

    const hashed = await bcrypt.hash("Test123!", 10);

    const user = await pool.query(`
        INSERT INTO users (first_name, last_name, email, hashed_password)
        VALUES ('Load','Test','load@test.com', $1)
        RETURNING user_id
    `, [hashed]);

    const userId = user.rows[0].user_id;

    
    const musics = await pool.query(`
        SELECT music_id FROM music LIMIT 20
    `);

    for (let i = 0; i < 5; i++) {

        const order = await pool.query(`
            INSERT INTO music_orders (user_id)
            VALUES ($1)
            RETURNING order_id
        `,[userId]);

        const orderId = order.rows[0].order_id;

        for (let j = 0; j < 3; j++) {
            const musicId = musics.rows[(i + j) % musics.rows.length].music_id;

            await pool.query(`
                INSERT INTO music_order_items (order_id, music_id, quantity)
                VALUES ($1,$2,1)
            `,[orderId, musicId]);
        }
    }

    return userId;
}

async function runLoadTest() {

    console.log("Load test indul...");

    await pool.query(`
        TRUNCATE users, music_orders, music_order_items RESTART IDENTITY CASCADE;
    `);

    const userId = await createTestUserWithOrders();

    const CONCURRENT_REQUESTS = 50;

    const requests = [];

    for (let i = 0; i < CONCURRENT_REQUESTS; i++) {
        requests.push(
            request(app)
                .post("/api/music_recommendations")
                .send({ userID: userId })
        );
    }

    console.time("Válaszidő");

    const responses = await Promise.all(requests);

    console.timeEnd("Válaszidő");

    const success = responses.filter(r => r.statusCode === 200).length;
    const failed = responses.length - success;

    console.log(`Sikeres: ${success}`);
    console.log(`Hibás: ${failed}`);

    process.exit();
}

runLoadTest();

