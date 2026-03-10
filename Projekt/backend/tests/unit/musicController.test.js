const { musicGet, getMusicGenres, getMusicLanguages, getMusicFormats } = require("../../controllers/musicController");
const db = require("../../database/queries/musicQuery");

jest.mock("../../database/queries/musicQuery");

describe("Music Controller", () => {

    test("musicGet visszaadja a zenéket", async () => {
        const fakeMusic = [
            { music_id: 1, title: "Imagine", performer: "John Lennon" },
            { music_id: 2, title: "Hey Jude", performer: "The Beatles" }
        ];

        db.getAllMusic.mockResolvedValue(fakeMusic);

        const req = { query: {} };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        await musicGet(req, res);

        expect(db.getAllMusic).toHaveBeenCalledWith(false);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(fakeMusic);
    });

    test("getMusicGenres visszaadja a zenei műfajokat", async () => {
        const fakeGenres = [
            { music_category_id: 1, genre: "Rock" },
            { music_category_id: 2, genre: "Pop" }
        ];

        db.getMusicGenres.mockResolvedValue(fakeGenres);

        const req = {};
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        await getMusicGenres(req, res);

        expect(db.getMusicGenres).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(fakeGenres);
    });

    test("getMusicLanguages visszaadja a nyelveket", async () => {
        const fakeLanguages = [
            { music_language_id: 1, language: "English" }
        ];

        db.getMusicLanguages.mockResolvedValue(fakeLanguages);

        const req = {};
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        await getMusicLanguages(req, res);

        expect(db.getMusicLanguages).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(fakeLanguages);
    });

    test("getMusicFormats visszaadja a formátumokat", async () => {
        const fakeFormats = [
            { format: "CD" },
            { format: "Vinyl" }
        ];

        db.getMusicFormats.mockResolvedValue(fakeFormats);

        const req = {};
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        await getMusicFormats(req, res);

        expect(db.getMusicFormats).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(fakeFormats);
    });

});

