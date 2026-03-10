const { 
    deleteMusic, deactivateMusic, restoreMusic, updateMusic,
    addMusicGenre, addMusicLanguage, addMusic, hasOrder
} = require("../../controllers/adminMusicController");

const db = require("../../database/queries/adminMusicQuery");
jest.mock("../../database/queries/adminMusicQuery");

describe("AdminMusic Controller", () => {

    test("deactivateMusic sikeres", async () => {
        const req = { params: { id: 1 } };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
        db.softDeleteMusic.mockResolvedValue();

        await deactivateMusic(req, res);

        expect(db.softDeleteMusic).toHaveBeenCalledWith(1);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: "Zene sikeresen deaktiválva!" });
    });

    test("restoreMusic sikeres", async () => {
        const req = { params: { id: 1 } };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
        db.restoreMusic.mockResolvedValue();

        await restoreMusic(req, res);

        expect(db.restoreMusic).toHaveBeenCalledWith(1);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: "Zene sikeresen visszaállítva!" });
    });

    test("deleteMusic sikeres", async () => {
        const req = { params: { id: 1 } };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
        db.deleteMusic.mockResolvedValue();

        await deleteMusic(req, res);

        expect(db.deleteMusic).toHaveBeenCalledWith(1);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: "Zene sikeresen törölve!" });
    });

    test("updateMusic sikeres", async () => {
        const req = { params: { id: 1 }, body: { title: "Új cím" } };
        const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };
        db.editMusic.mockResolvedValue();

        await updateMusic(req, res);

        expect(db.editMusic).toHaveBeenCalledWith(1, { title: "Új cím" });
        expect(res.json).toHaveBeenCalledWith({ message: "Zene sikeresen módosítva!" });
    });

    test("addMusicGenre sikeres", async () => {
        const req = { body: { genre: "Pop" } };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
        db.insertGenre.mockResolvedValue();

        await addMusicGenre(req, res);

        expect(db.insertGenre).toHaveBeenCalledWith("Pop");
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: "Műfaj sikeresen hozzáadva!" });
    });

    test("addMusicLanguage sikeres", async () => {
        const req = { body: { language: "Angol" } };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
        db.insertLanguage.mockResolvedValue();

        await addMusicLanguage(req, res);

        expect(db.insertLanguage).toHaveBeenCalledWith("Angol");
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: "Nyelv sikeresen hozzáadva!" });
    });

    test("addMusic sikeres", async () => {
        const req = { body: { title: "Új Zene", quantity: 10 } };
        const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };
        db.insertMusic.mockResolvedValue();

        await addMusic(req, res);

        expect(db.insertMusic).toHaveBeenCalledWith({ title: "Új Zene", quantity: 10 });
        expect(res.json).toHaveBeenCalledWith({ message: "Zene sikeresen hozzáadva!" });
    });

    test("hasOrder sikeres", async () => {
        const req = { params: { id: 1 } };
        const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };
        db.musicHasOrder.mockResolvedValue(true);

        await hasOrder(req, res);

        expect(db.musicHasOrder).toHaveBeenCalledWith(1);
        expect(res.json).toHaveBeenCalledWith({ hasOrder: true });
    });

});

