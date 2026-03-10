const { postNewMessage } = require("../../controllers/messageController");
const db = require("../../database/queries/messageQuery");
const nodemailer = require("nodemailer");

jest.mock("../../database/queries/messageQuery");
jest.mock("nodemailer");

describe("Message Controller", () => {

    test("postNewMessage sikeresen elküld egy üzenetet", async () => {
        db.insertMessage.mockResolvedValue();

        const sendMailMock = jest.fn().mockResolvedValue();
        nodemailer.createTransport.mockReturnValue({ sendMail: sendMailMock });

        const req = {
            body: {
                keresztnev: "John",
                vezeteknev: "Doe",
                email: "john@example.com",
                uzenet: "Hello world"
            }
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        await postNewMessage(req, res);

        expect(db.insertMessage).toHaveBeenCalledWith("John", "Doe", "john@example.com", "Hello world");
        expect(sendMailMock).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: "Üzenet sikeresen elküldve!" });
    });

    test("postNewMessage hibát kezel", async () => {
        db.insertMessage.mockRejectedValue(new Error("DB hiba"));

        const req = {
            body: {
                keresztnev: "John",
                vezeteknev: "Doe",
                email: "john@example.com",
                uzenet: "Hello world"
            }
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        await postNewMessage(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: "Hiba történt az üzenet küldésekor" });
    });

});

