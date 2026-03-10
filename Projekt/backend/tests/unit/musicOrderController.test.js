const { postMusicOrder } = require("../../controllers/musicOrderController");
const db = require("../../database/queries/musicOrderQuery");
const nodemailer = require("nodemailer");

jest.mock("../../database/queries/musicOrderQuery");
jest.mock("nodemailer");

describe("MusicOrder Controller", () => {

    test("postMusicOrder sikeres rendelés", async () => {
        const req = {
            body: {
                music: [
                    { title: "Zene1", music_id: 1, music_storage_id: 10, qty: 1, price: 1000 },
                    { title: "Zene2", music_id: 2, music_storage_id: 20, qty: 2, price: 1500 }
                ],
                teljesAr: 4000,
                user: { user_id: 1, first_name: "John", last_name: "Doe" }
            }
        };

        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        db.insertMusicOrder.mockResolvedValue(123);

        const sendMailMock = jest.fn().mockResolvedValue();
        nodemailer.createTransport.mockReturnValue({ sendMail: sendMailMock });

        await postMusicOrder(req, res);

        expect(db.insertMusicOrder).toHaveBeenCalledWith(1, req.body.music);
        expect(sendMailMock).toHaveBeenCalled();
        expect(res.json).toHaveBeenCalledWith({ message: "A rendelés sikeresen rögzítve, e-mail elküldve!" });
    });

    test("postMusicOrder hibát kezel", async () => {
        const req = { body: { music: [], teljesAr: 0, user: { user_id: 1 } } };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        db.insertMusicOrder.mockRejectedValue(new Error("DB hiba"));

        await postMusicOrder(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: "Hiba a rendelés mentésekor." });
    });

});

