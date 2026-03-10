const { 
    deleteFilm, deactivateFilm, restoreFilm, updateFilm, 
    addFilmGenre, addFilmLanguage, addFilm, hasOrder 
} = require("../../controllers/adminFilmsController");

const db = require("../../database/queries/adminFilmsQuery");
jest.mock("../../database/queries/adminFilmsQuery");

describe("AdminFilms Controller", () => {

    test("deactivateFilm sikeres", async () => {
        const req = { params: { id: 1 } };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
        db.softDeleteFilm.mockResolvedValue();

        await deactivateFilm(req, res);

        expect(db.softDeleteFilm).toHaveBeenCalledWith(1);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: "Film sikeresen deaktiválva!" });
    });

    test("restoreFilm sikeres", async () => {
        const req = { params: { id: 1 } };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
        db.restoreFilm.mockResolvedValue();

        await restoreFilm(req, res);

        expect(db.restoreFilm).toHaveBeenCalledWith(1);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: "Film sikeresen visszaállítva!" });
    });

    test("deleteFilm sikeres", async () => {
        const req = { params: { id: 1 } };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
        db.deleteFilm.mockResolvedValue();

        await deleteFilm(req, res);

        expect(db.deleteFilm).toHaveBeenCalledWith(1);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: "Film sikeresen törölve!" });
    });

    test("updateFilm sikeres", async () => {
        const req = { params: { id: 1 }, body: { title: "Új cím" } };
        const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };
        db.editFilm.mockResolvedValue();

        await updateFilm(req, res);

        expect(db.editFilm).toHaveBeenCalledWith(1, { title: "Új cím" });
        expect(res.json).toHaveBeenCalledWith({ message: "Film sikeresen módosítva!" });
    });

    test("addFilmGenre sikeres", async () => {
        const req = { body: { genre: "Akció" } };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
        db.insertGenre.mockResolvedValue();

        await addFilmGenre(req, res);

        expect(db.insertGenre).toHaveBeenCalledWith("Akció");
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: "Műfaj sikeresen hozzáadva!" });
    });

    test("addFilmLanguage sikeres", async () => {
        const req = { body: { language: "Angol" } };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
        db.insertLanguage.mockResolvedValue();

        await addFilmLanguage(req, res);

        expect(db.insertLanguage).toHaveBeenCalledWith("Angol");
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: "Nyelv sikeresen hozzáadva!" });
    });

    test("addFilm sikeres", async () => {
        const req = { body: { title: "Új Film", quantity: 10 } };
        const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };
        db.insertFilm.mockResolvedValue();

        await addFilm(req, res);

        expect(db.insertFilm).toHaveBeenCalledWith({ title: "Új Film", quantity: 10 });
        expect(res.json).toHaveBeenCalledWith({ message: "Film sikeresen hozzáadva!" });
    });

    test("hasOrder sikeres", async () => {
        const req = { params: { id: 1 } };
        const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };
        db.filmHasOrder.mockResolvedValue(true);

        await hasOrder(req, res);

        expect(db.filmHasOrder).toHaveBeenCalledWith(1);
        expect(res.json).toHaveBeenCalledWith({ hasOrder: true });
    });

});

