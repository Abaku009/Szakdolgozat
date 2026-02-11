const { Router } = require("express");
const musicRecommendationController = require("../controllers/musicRecommendationController");
const router = Router();

router.post("/", musicRecommendationController.getMusicRecommendations);

module.exports = router;

