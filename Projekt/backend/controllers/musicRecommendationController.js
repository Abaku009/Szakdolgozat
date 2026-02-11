const db = require("../database/recommendations/musicRecommendation");

async function getMusicRecommendations(req, res) {
    const { user } = req.body;

    try {
        const recommendations = await db.musicRecommendations(user);
        res.status(200).json(recommendations);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Hiba az ajánlás során!" });
    }
}

module.exports = { getMusicRecommendations };

