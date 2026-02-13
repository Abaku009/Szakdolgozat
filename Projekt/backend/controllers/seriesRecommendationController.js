const db = require("../database/recommendations/seriesRecommendation");

async function getSeriesRecommendations(req, res) {
    const { userID } = req.body;

    try {
        const recommendations = await db.seriesRecommendations(userID);
        res.status(200).json(recommendations);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Hiba az ajánlás során!" });
    }
}

module.exports = { getSeriesRecommendations };

