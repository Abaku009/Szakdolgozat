const { passwordUpdate } = require("../../controllers/profilController");
const db = require("../../database/queries/profilQuery");
const bcrypt = require("bcrypt");

jest.mock("../../database/queries/profilQuery");
jest.mock("bcrypt");

describe("Profil Controller", () => {

    test("passwordUpdate sikeresen módosítja a jelszót", async () => {
        const req = { body: { ujJelszo: "ujJelszo123", id: 1 } };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        bcrypt.hash.mockResolvedValue("hashedPassword");
        db.updateNewPassword.mockResolvedValue();

        await passwordUpdate(req, res);

        expect(bcrypt.hash).toHaveBeenCalledWith("ujJelszo123", 10);
        expect(db.updateNewPassword).toHaveBeenCalledWith("hashedPassword", 1);
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({ message: "Jelszó módosítás sikeres!" });
    });

    test("passwordUpdate hibát kezel", async () => {
        const req = { body: { ujJelszo: "ujJelszo123", id: 1 } };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        bcrypt.hash.mockRejectedValue(new Error("Hiba a hash-elésnél"));

        await passwordUpdate(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: "Szerverhiba történt!" });
    });

});

