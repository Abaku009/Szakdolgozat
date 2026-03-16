const request = require("supertest");
const app = require("../../app");
const pool = require("../../database/pool/pool");

describe("POST /api/registration", () => {
    const testUser = {
        vezeteknev: "Felhasználó",
        keresztnev: "Teszt",
        email: "tesztuser@example.com",
        jelszo: "Teszt123!"
    };

    beforeEach(async () => {
        await pool.query(`TRUNCATE users RESTART IDENTITY CASCADE`);
    });

    afterEach(async () => {
        await pool.query(`TRUNCATE users RESTART IDENTITY CASCADE`);
    });

    it("should successfully register a new user", async () => {
        const res = await request(app)
            .post("/api/registration")
            .send(testUser)
            .set("Accept", "application/json");

        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty("message", "Sikeres regisztráció!");

        const { rows } = await pool.query(
            `SELECT * FROM users WHERE email = $1`,
            [testUser.email]
        );

        expect(rows.length).toBe(1);
        expect(rows[0].first_name).toBe(testUser.keresztnev);
        expect(rows[0].last_name).toBe(testUser.vezeteknev);
    });

    it("should fail if the email is already registered", async () => {
        await request(app)
            .post("/api/registration")
            .send(testUser)
            .set("Accept", "application/json");

        const res = await request(app)
            .post("/api/registration")
            .send(testUser)
            .set("Accept", "application/json");

        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty("message");
        expect(res.body.message.toLowerCase()).toMatch(/ez az e-mail már regisztrálva van/i);
    });
});

