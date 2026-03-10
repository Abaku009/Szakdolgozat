const { postNewUser } = require("../../controllers/registrationController");
const db = require("../../database/queries/registrationQuery");
const bcrypt = require("bcrypt");

jest.mock("../../database/queries/registrationQuery");
jest.mock("bcrypt");

describe("Registration Controller", () => {

    test("postNewUser sikeres regisztráció", async () => {
        const req = { body: { vezeteknev: "Doe", keresztnev: "John", email: "john@example.com", jelszo: "password123" } };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        db.checkEmail.mockResolvedValue({ rows: [] });
        bcrypt.hash.mockResolvedValue("hashedPassword");
        db.insertNewUser.mockResolvedValue();

        await postNewUser(req, res);

        expect(db.checkEmail).toHaveBeenCalledWith("john@example.com");
        expect(bcrypt.hash).toHaveBeenCalledWith("password123", 10);
        expect(db.insertNewUser).toHaveBeenCalledWith("Doe", "John", "john@example.com", "hashedPassword");
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({ message: "Sikeres regisztráció!" });
    });

    test("postNewUser hibás email (már regisztrálva)", async () => {
        const req = { body: { vezeteknev: "Doe", keresztnev: "John", email: "john@example.com", jelszo: "password123" } };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        db.checkEmail.mockResolvedValue({ rows: [{ user_id: 1 }] });

        await postNewUser(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: "Ez az e-mail már regisztrálva van!" });
    });

    test("postNewUser hibát kezel", async () => {
        const req = { body: { vezeteknev: "Doe", keresztnev: "John", email: "john@example.com", jelszo: "password123" } };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        db.checkEmail.mockRejectedValue(new Error("DB hiba"));

        await postNewUser(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: "Szerver hiba történt." });
    });

});

