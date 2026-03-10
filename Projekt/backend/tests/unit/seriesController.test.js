const { seriesGet, genresGet, languagesGet, formatsGet } = require("../../controllers/seriesController");
const db = require("../../database/queries/seriesQuery");

jest.mock("../../database/queries/seriesQuery");

describe("Series Controller", () => {

    test("seriesGet visszaadja a sorozatokat", async () => {
        const fakeSeries = [
            { series_id: 1, title: "Breaking Bad" },
            { series_id: 2, title: "Dark" }
        ];

        db.getAllSeries.mockResolvedValue(fakeSeries);

        const req = {
            query: {}
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        await seriesGet(req, res);

        expect(db.getAllSeries).toHaveBeenCalledWith(false);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(fakeSeries);
    });

    test("genresGet visszaadja a műfajokat", async () => {
        const fakeGenres = [
            { series_category_id: 1, genre: "Drama" },
            { series_category_id: 2, genre: "Sci-Fi" }
        ];

        db.getSeriesGenres.mockResolvedValue(fakeGenres);

        const req = {};

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        await genresGet(req, res);

        expect(db.getSeriesGenres).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(fakeGenres);
    });

    test("languagesGet visszaadja a nyelveket", async () => {
        const fakeLanguages = [
            { series_language_id: 1, language: "English" }
        ];

        db.getSeriesLanguages.mockResolvedValue(fakeLanguages);

        const req = {};

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        await languagesGet(req, res);

        expect(db.getSeriesLanguages).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(fakeLanguages);
    });

    test("formatsGet visszaadja a formátumokat", async () => {
        const fakeFormats = [
            { format: "DVD" },
            { format: "Blu-ray" }
        ];

        db.getSeriesFormats.mockResolvedValue(fakeFormats);

        const req = {};

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        await formatsGet(req, res);

        expect(db.getSeriesFormats).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(fakeFormats);
    });

});

