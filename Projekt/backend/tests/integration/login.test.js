const request = require("supertest");
const app = require("../../app");
const pool = require("../../database/pool/pool");
const bcrypt = require("bcrypt");

describe("POST /api/login", () => {

    beforeEach(async () => {

        const hashedPassword = await bcrypt.hash("123456", 10);

        await pool.query(`
            INSERT INTO users (first_name, last_name, email, hashed_password, is_admin)
            VALUES ($1, $2, $3, $4, $5)
        `, [
            "Test",
            "User",
            "test@test.com",
            hashedPassword,
            false
        ]);

    });


    afterEach(async () => {

        await pool.query(`
            TRUNCATE users RESTART IDENTITY CASCADE
        `);

    });


    test("successful login", async () => {

        const res = await request(app)
            .post("/api/login")
            .send({
                emailcim: "test@test.com",
                jelszo: "123456"
            });

        expect(res.statusCode).toBe(200);

    });

    test("login fails with wrong password", async () => {

        const res = await request(app)
            .post("/api/login")
            .send({
                emailcim: "test@test.com",
                jelszo: "rosszjelszo"
            });

        expect(res.statusCode).toBe(401);

    });

});

