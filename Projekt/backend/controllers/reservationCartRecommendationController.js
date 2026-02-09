const db = require("../database/recommendations/reservationCartRecommendation");

async function getReservationCartRecommendations(req, res) {
    const { cartIDs } = req.body;

    try {
        const recommendations = await db.reservationCartRecommendations(cartIDs);
        res.status(200).json(recommendations);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Hiba az ajánlás során!" });
    }
}

module.exports = { getReservationCartRecommendations };

