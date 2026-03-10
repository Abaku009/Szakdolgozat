const { musicRecommendations } = require("../../database/recommendations/musicRecommendation");
const pool = require("../../database/pool/pool");

jest.mock("../../database/pool/pool", () => ({
    query: jest.fn()
}));

describe("musicRecommendations", () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("üres userID esetén üres tömb", async () => {
        const result = await musicRecommendations(null);
        expect(result).toEqual([]);
    });

    test("nincs előző rendelés, üres ajánlás", async () => {
        pool.query.mockResolvedValueOnce({ rows: [] });
        const result = await musicRecommendations(1);
        expect(result).toEqual([]);
    });

    test("visszaadott zenéket score-olja és top 3-at adja", async () => {
        const orderData = [
            { music_category_id: 1, music_language_id: 1, performer: "Artist A", time: "2026-03-01" }
        ];

        const recommendable = [
            { music_id: 2, music_category_id: 1, music_language_id: 1, performer: "Artist A", title: "Song X", price: 100, format: "MP3", is_active: true, music_storage_id: 1, categoryname: "Pop", languagename: "English", stock: 10 },
            { music_id: 3, music_category_id: 2, music_language_id: 2, performer: "Artist B", title: "Song Y", price: 120, format: "MP3", is_active: true, music_storage_id: 2, categoryname: "Rock", languagename: "English", stock: 5 }
        ];

        pool.query.mockResolvedValueOnce({ rows: orderData });
        pool.query.mockResolvedValueOnce({ rows: recommendable });

        const result = await musicRecommendations(1);

        expect(result.length).toBeGreaterThan(0);
        expect(result[0]).toHaveProperty("score");
        expect(result[0].music_id).toBe(2);
    });

});

