const { filmRecommendations } = require("../../database/recommendations/filmRecommendation");
const pool = require("../../database/pool/pool");

jest.mock("../../database/pool/pool", () => ({
    query: jest.fn()
}));

describe("filmRecommendations", () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("üres userID esetén üres tömb", async () => {
        const result = await filmRecommendations(null);
        expect(result).toEqual([]);
    });

    test("nincs előző foglalás, üres ajánlás", async () => {
        pool.query.mockResolvedValueOnce({ rows: [] });
        const result = await filmRecommendations(1);
        expect(result).toEqual([]);
    });

    test("visszaadott filmeket score-olja és top 3-at adja", async () => {
        const reservationData = [
            { film_category_id: 1, film_language_id: 1, director: "Dir A", reserved_date_from: "2026-03-01" }
        ];

        const recommendable = [
            { film_id: 2, film_category_id: 1, film_language_id: 1, director: "Dir A", title: "Film X", price: 100, format: "DVD", is_active: true, film_storage_id: 1, categoryname: "Action", languagename: "English", stock: 10 },
            { film_id: 3, film_category_id: 2, film_language_id: 2, director: "Dir B", title: "Film Y", price: 120, format: "DVD", is_active: true, film_storage_id: 2, categoryname: "Comedy", languagename: "English", stock: 5 }
        ];

        pool.query.mockResolvedValueOnce({ rows: reservationData });
        pool.query.mockResolvedValueOnce({ rows: recommendable });

        const result = await filmRecommendations(1);

        expect(result.length).toBeGreaterThan(0);
        expect(result[0]).toHaveProperty("score");
        expect(result[0].film_id).toBe(2);
    });
});

