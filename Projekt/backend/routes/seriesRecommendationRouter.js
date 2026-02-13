const { Router } = require("express");
const seriesRecommendationController = require("../controllers/seriesRecommendationController");
const router = Router();

router.post("/", seriesRecommendationController.getSeriesRecommendations);

module.exports = router;

