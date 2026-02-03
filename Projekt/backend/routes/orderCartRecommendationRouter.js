const { Router } = require("express");
const orderCartRecommendationController = require("../controllers/orderCartRecommendationController");
const router = Router();

router.post("/", orderCartRecommendationController.getOrderCartRecommendations);

module.exports = router;

