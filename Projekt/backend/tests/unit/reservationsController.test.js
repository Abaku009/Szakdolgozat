const { postReservations } = require("../../controllers/reservationsController");
const db = require("../../database/queries/reservationsQuery");
const nodemailer = require("nodemailer");

jest.mock("../../database/queries/reservationsQuery");
jest.mock("nodemailer");

describe("Reservations Controller", () => {

    test("postReservations sikeres foglalás", async () => {
        const req = {
            body: {
                termekek: [
                    { title: "Film1", type: "film", film_id: 1, film_storage_id: 10, qty: 1, price: 1000 },
                    { title: "Sorozat1", type: "series", series_id: 2, series_storage_id: 20, qty: 2, price: 1500 }
                ],
                teljesAr: 4000,
                user: { user_id: 1, first_name: "John", last_name: "Doe" },
                mode: "online",
                dateFrom: "2026-03-10",
                dateTo: "2026-03-11",
                timeFrom: "10:00",
                timeTo: "12:00"
            }
        };

        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        db.insertReservations.mockResolvedValue(123);

        const sendMailMock = jest.fn().mockResolvedValue();
        nodemailer.createTransport.mockReturnValue({ sendMail: sendMailMock });

        await postReservations(req, res);

        expect(db.insertReservations).toHaveBeenCalledWith(
            1, req.body.termekek, "online", "2026-03-10", "2026-03-11", "10:00", "12:00"
        );

        expect(sendMailMock).toHaveBeenCalled();
        expect(res.json).toHaveBeenCalledWith({ message: "A foglalás sikeresen rögzítve, e-mail elküldve!" });
    });

    test("postReservations hibát kezel", async () => {
        const req = { body: { termekek: [], teljesAr: 0, user: { user_id: 1 }, mode: "online", dateFrom: "", dateTo: "", timeFrom: "", timeTo: "" } };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        db.insertReservations.mockRejectedValue(new Error("DB hiba"));

        await postReservations(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: "Hiba a foglalás mentésekor." });
    });

});

