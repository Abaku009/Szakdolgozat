const { seriesRecommendations } = require("../../database/recommendations/seriesRecommendation");
const pool = require("../../database/pool/pool");

jest.mock("../../database/pool/pool", () => ({
    query: jest.fn()
}));

describe("seriesRecommendations", () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("üres userID esetén üres tömb", async () => {
        const result = await seriesRecommendations(null);
        expect(result).toEqual([]);
    });

    test("nincs előző foglalás, üres ajánlás", async () => {
        pool.query.mockResolvedValueOnce({ rows: [] });
        const result = await seriesRecommendations(1);
        expect(result).toEqual([]);
    });

    test("visszaadott sorozatokat score-olja és top 3-at adja", async () => {
        const reservationData = [
            { series_category_id: 1, series_language_id: 1, creator: "Creator A", reserved_date_from: "2026-03-01" }
        ];

        const recommendable = [
            { series_id: 2, series_category_id: 1, series_language_id: 1, creator: "Creator A", title: "Serie X", price: 100, format: "MP4", is_active: true, series_storage_id: 1, categoryname: "Drama", languagename: "English", stock: 10 },
            { series_id: 3, series_category_id: 2, series_language_id: 2, creator: "Creator B", title: "Serie Y", price: 120, format: "MP4", is_active: true, series_storage_id: 2, categoryname: "Comedy", languagename: "English", stock: 5 }
        ];

        pool.query.mockResolvedValueOnce({ rows: reservationData });
        pool.query.mockResolvedValueOnce({ rows: recommendable });

        const result = await seriesRecommendations(1);

        expect(result.length).toBeGreaterThan(0);
        expect(result[0]).toHaveProperty("score");
        expect(result[0].series_id).toBe(2);
    });

});

