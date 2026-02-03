const db = require("../database/recommendations/orderCartRecommendation");

async function getOrderCartRecommendations(req, res) {
    try {
        const { cartMusicIDs } = req.body;

        const recommendations = await db.orderCartRecommendations(cartMusicIDs);
        res.status(200).json(recommendations);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Hiba az ajánlás során!" });
    }
}

module.exports = { getOrderCartRecommendations };

