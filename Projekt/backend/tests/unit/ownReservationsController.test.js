const { getOwnReservations } = require("../../controllers/ownReservationsController");
const db = require("../../database/queries/ownReservationsQuery");

jest.mock("../../database/queries/ownReservationsQuery");

describe("OwnReservations Controller", () => {

    test("getOwnReservations sikeresen visszaadja a foglalásokat", async () => {
        const req = { body: { user: { user_id: 1 } } };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        const mockReservations = [
            { reservation_id: 1, mode: "online", reserved_date_from: "2026-03-10", reserved_date_to: "2026-03-11", quantity: 2, film_title: "Film1", series_title: null },
            { reservation_id: 2, mode: "on-site", reserved_date_from: "2026-03-12", reserved_date_to: "2026-03-13", quantity: 1, film_title: null, series_title: "Sorozat1" },
        ];

        db.getOwnReservations.mockResolvedValue(mockReservations);

        await getOwnReservations(req, res);

        expect(db.getOwnReservations).toHaveBeenCalledWith(1);
        expect(res.json).toHaveBeenCalledWith(mockReservations);
    });

    test("getOwnReservations hiányzó felhasználó", async () => {
        const req = { body: {} };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        await getOwnReservations(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: "Felhasználó hiányzik" });
    });

    test("getOwnReservations hibát kezel", async () => {
        const req = { body: { user: { user_id: 1 } } };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        db.getOwnReservations.mockRejectedValue(new Error("DB hiba"));

        await getOwnReservations(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: "Hiba a saját foglalások lekérésekor." });
    });

});

