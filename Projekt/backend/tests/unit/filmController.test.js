const { filmsGet, genresGet, languagesGet, formatsGet } = require("../../controllers/filmController");
const db = require("../../database/queries/filmQuery");

jest.mock("../../database/queries/filmQuery");

describe("Film Controller", () => {

    test("filmsGet visszaadja a filmeket", async () => {
        const fakeFilms = [
            { film_id: 1, title: "Inception" },
            { film_id: 2, title: "Interstellar" }
        ];

        db.getAllFilms.mockResolvedValue(fakeFilms);

        const req = {
            query: {}
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        await filmsGet(req, res);

        expect(db.getAllFilms).toHaveBeenCalledWith(false);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(fakeFilms);
    });


    test("genresGet visszaadja a film műfajokat", async () => {
        const fakeGenres = [
            { film_category_id: 1, genre: "Action" },
            { film_category_id: 2, genre: "Drama" }
        ];

        db.getFilmGenres.mockResolvedValue(fakeGenres);

        const req = {};

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        await genresGet(req, res);

        expect(db.getFilmGenres).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(fakeGenres);
    });


    test("languagesGet visszaadja a film nyelveket", async () => {
        const fakeLanguages = [
            { film_language_id: 1, language: "English" }
        ];

        db.getFilmLanguages.mockResolvedValue(fakeLanguages);

        const req = {};

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        await languagesGet(req, res);

        expect(db.getFilmLanguages).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(fakeLanguages);
    });


    test("formatsGet visszaadja a film formátumokat", async () => {
        const fakeFormats = [
            { format: "DVD" },
            { format: "Blu-ray" }
        ];

        db.getFilmFormats.mockResolvedValue(fakeFormats);

        const req = {};

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        await formatsGet(req, res);

        expect(db.getFilmFormats).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(fakeFormats);
    });


    test("filmsGet showInactive true esetén", async () => {

        db.getAllFilms.mockResolvedValue([]);

        const req = {
            query: { showInactive: "true" }
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        await filmsGet(req, res);

        expect(db.getAllFilms).toHaveBeenCalledWith(true);
    });

});

