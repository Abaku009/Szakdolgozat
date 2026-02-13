const { Router } = require("express");
const filmRecommendationController = require("../controllers/filmRecommendationController");
const router = Router();

router.post("/", filmRecommendationController.getFilmRecommendations);

module.exports = router;

