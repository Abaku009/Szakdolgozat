const request = require("supertest");
const app = require("../../app");
const pool = require("../../database/pool/pool");
const bcrypt = require("bcrypt");

describe("User Endpoints", () => {
    const testUser = {
        vezeteknev: "Teszt",
        keresztnev: "Felhasználó",
        email: "tesztuser@example.com",
        jelszo: "Teszt123!"
    };

    const testAdmin = {
        first_name: "Admin",
        last_name: "User",
        email: "tesztadmin@example.com",
        password: "Admin123!",
        is_admin: true
    };

    let userCookie;
    let adminCookie;

    beforeEach(async () => {
        await pool.query(`
            TRUNCATE users RESTART IDENTITY CASCADE
        `);

        const hashedAdmin = await bcrypt.hash(testAdmin.password, 10);
        await pool.query(`
            INSERT INTO users (first_name, last_name, email, hashed_password, is_admin)
            VALUES ($1,$2,$3,$4,$5)`, 
            [testAdmin.first_name, testAdmin.last_name, testAdmin.email, hashedAdmin, testAdmin.is_admin]
        );
    });

    afterEach(async () => {
        await pool.query(`
            TRUNCATE users, music_orders, music_order_items
            RESTART IDENTITY CASCADE
        `);

    });

    test("User registration, login, profile, logout flow", async () => {
        const regRes = await request(app)
            .post("/api/registration")
            .send(testUser)
            .set("Accept", "application/json");
        expect(regRes.statusCode).toBe(201);

        const loginRes = await request(app)
            .post("/api/login")
            .send({ emailcim: testUser.email, jelszo: testUser.jelszo });
        expect(loginRes.statusCode).toBe(200);
        userCookie = loginRes.headers['set-cookie'];

        const profileRes = await request(app)
            .get("/api/current_user")
            .set("Cookie", userCookie);
        expect(profileRes.statusCode).toBe(200);
        expect(profileRes.body.user.email).toBe(testUser.email);
        expect(profileRes.body.user.is_admin).toBe(false);

        const logoutRes = await request(app)
            .get("/api/logout")
            .set("Cookie", userCookie);
        expect(logoutRes.statusCode).toBe(200);

        const guestProfile = await request(app)
            .get("/api/current_user");
        expect(guestProfile.statusCode).toBe(200);
        expect(guestProfile.body.user).toBeNull();
    });

    test("Admin login and role check", async () => {
        const loginRes = await request(app)
            .post("/api/login")
            .send({ emailcim: testAdmin.email, jelszo: testAdmin.password });
        expect(loginRes.statusCode).toBe(200);
        adminCookie = loginRes.headers['set-cookie'];

        const profileRes = await request(app)
            .get("/api/current_user")
            .set("Cookie", adminCookie);
        expect(profileRes.statusCode).toBe(200);
        expect(profileRes.body.user.is_admin).toBe(true);
    });
});

