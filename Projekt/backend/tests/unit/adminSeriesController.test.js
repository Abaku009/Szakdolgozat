const { 
    deleteSerie, deactivateSerie, restoreSerie, updateSerie,
    addSerieGenre, addSerieLanguage, addSerie, hasOrder
} = require("../../controllers/adminSeriesController");

const db = require("../../database/queries/adminSeriesQuery");
jest.mock("../../database/queries/adminSeriesQuery");

describe("AdminSeries Controller", () => {

    test("deactivateSerie sikeres", async () => {
        const req = { params: { id: 1 } };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
        db.softDeleteSerie.mockResolvedValue();

        await deactivateSerie(req, res);

        expect(db.softDeleteSerie).toHaveBeenCalledWith(1);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: "Sorozat sikeresen deaktiválva!" });
    });

    test("restoreSerie sikeres", async () => {
        const req = { params: { id: 1 } };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
        db.restoreSerie.mockResolvedValue();

        await restoreSerie(req, res);

        expect(db.restoreSerie).toHaveBeenCalledWith(1);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: "Sorozat sikeresen visszaállítva!" });
    });

    test("deleteSerie sikeres", async () => {
        const req = { params: { id: 1 } };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
        db.deleteSerie.mockResolvedValue();

        await deleteSerie(req, res);

        expect(db.deleteSerie).toHaveBeenCalledWith(1);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: "Sorozat sikeresen törölve!" });
    });

    test("updateSerie sikeres", async () => {
        const req = { params: { id: 1 }, body: { title: "Új cím" } };
        const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };
        db.editSerie.mockResolvedValue();

        await updateSerie(req, res);

        expect(db.editSerie).toHaveBeenCalledWith(1, { title: "Új cím" });
        expect(res.json).toHaveBeenCalledWith({ message: "Sorozat sikeresen módosítva!" });
    });

    test("addSerieGenre sikeres", async () => {
        const req = { body: { genre: "Kaland" } };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
        db.insertGenre.mockResolvedValue();

        await addSerieGenre(req, res);

        expect(db.insertGenre).toHaveBeenCalledWith("Kaland");
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: "Műfaj sikeresen hozzáadva!" });
    });

    test("addSerieLanguage sikeres", async () => {
        const req = { body: { language: "Francia" } };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
        db.insertLanguage.mockResolvedValue();

        await addSerieLanguage(req, res);

        expect(db.insertLanguage).toHaveBeenCalledWith("Francia");
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: "Nyelv sikeresen hozzáadva!" });
    });

    test("addSerie sikeres", async () => {
        const req = { body: { title: "Új Sorozat", quantity: 5 } };
        const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };
        db.insertSerie.mockResolvedValue();

        await addSerie(req, res);

        expect(db.insertSerie).toHaveBeenCalledWith({ title: "Új Sorozat", quantity: 5 });
        expect(res.json).toHaveBeenCalledWith({ message: "Sorozat sikeresen hozzáadva!" });
    });

    test("hasOrder sikeres", async () => {
        const req = { params: { id: 1 } };
        const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };
        db.serieHasOrder.mockResolvedValue(true);

        await hasOrder(req, res);

        expect(db.serieHasOrder).toHaveBeenCalledWith(1);
        expect(res.json).toHaveBeenCalledWith({ hasOrder: true });
    });

});

