const { getAdminReservations, deleteAdminReservations } = require("../../controllers/adminReservationsController");
const db = require("../../database/queries/adminReservationsQuery");
const nodemailer = require("nodemailer");

jest.mock("../../database/queries/adminReservationsQuery");
jest.mock("nodemailer");

describe("AdminReservations Controller", () => {

    test("getAdminReservations sikeres lekérés", async () => {
        const req = { body: { user: { is_admin: true } } };
        const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };

        const mockReservations = [{ reservation_id: 1 }, { reservation_id: 2 }];
        db.getAllUsersReservations.mockResolvedValue(mockReservations);

        await getAdminReservations(req, res);

        expect(db.getAllUsersReservations).toHaveBeenCalled();
        expect(res.json).toHaveBeenCalledWith(mockReservations);
    });

    test("getAdminReservations jogosultság hiányzik", async () => {
        const req = { body: { user: { is_admin: false } } };
        const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };

        await getAdminReservations(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: "Nincs jogosultságod!" });
    });

    test("deleteAdminReservations sikeres törlés", async () => {
        const sendMailMock = jest.fn().mockResolvedValue(true);
        nodemailer.createTransport.mockReturnValue({ sendMail: sendMailMock });

        const reservation = {
            reservation_id: 1,
            mode: "on_site",
            reserved_date_from: "2026-03-10",
            reserved_date_to: "2026-03-11",
            reserved_from: "10:00",
            reserved_to: "12:00",
            items: [{ type: "film", id: 1, title: "Film1", quantity: 2 }]
        };

        const req = {
            body: {
                adminUser: { is_admin: true },
                reservationOwner: { first_name: "John", last_name: "Doe" },
                reservation,
                reason: "Teszt"
            }
        };
        const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };

        db.deleteReservations.mockResolvedValue();

        await deleteAdminReservations(req, res);

        expect(db.deleteReservations).toHaveBeenCalledWith(reservation);
        expect(sendMailMock).toHaveBeenCalled();
        expect(res.json).toHaveBeenCalledWith({ message: "Foglalás sikeresen törölve!" });
    });

    test("deleteAdminReservations jogosultság hiányzik", async () => {
        const req = { body: { adminUser: { is_admin: false } } };
        const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };

        await deleteAdminReservations(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: "Nincs jogosultságod!" });
    });

});

