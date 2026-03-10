const { reservationCartRecommendations } = require("../../database/recommendations/reservationCartRecommendation");
const pool = require("../../database/pool/pool");

jest.mock("../../database/pool/pool", () => ({
    query: jest.fn()
}));

describe("reservationCartRecommendations", () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("üres cartIDs esetén üres tömb", async () => {
        const result = await reservationCartRecommendations([]);
        expect(result).toEqual([]);
    });

    test("film és series scoring, top 4 kiválasztás", async () => {
        const cartIDs = [
            { type: "film", id: 1 },
            { type: "series", id: 10 }
        ];

        const cartFilmsData = [{ film_id: 1, film_category_id: 1, film_language_id: 1, director: "Director A" }];
        const cartSeriesData = [{ series_id: 10, series_category_id: 2, series_language_id: 2, creator: "Creator B" }];

        const filmRecommendable = [
            { id: 2, film_id: 2, type: "film", title: "Film X", director: "Director A", film_category_id: 1, film_language_id: 1, price: 100, format: "MP4", categoryname: "Action", languagename: "English", stock: 5, film_storage_id: 2, is_active: true }
        ];

        const seriesRecommendable = [
            { id: 11, series_id: 11, type: "series", title: "Series Y", creator: "Creator B", series_category_id: 2, series_language_id: 2, price: 200, format: "HD", categoryname: "Drama", languagename: "English", stock: 3, series_storage_id: 11, is_active: true }
        ];

        pool.query
            .mockResolvedValueOnce({ rows: cartFilmsData })
            .mockResolvedValueOnce({ rows: filmRecommendable })
            .mockResolvedValueOnce({ rows: cartSeriesData })
            .mockResolvedValueOnce({ rows: seriesRecommendable });

        const result = await reservationCartRecommendations(cartIDs);

        expect(result).toHaveLength(2);
        expect(result[0]).toHaveProperty("score");
        expect(result[0].type).toBe("film");
        expect(result[1].type).toBe("series");
    });

});

