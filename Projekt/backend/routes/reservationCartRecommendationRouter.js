const { Router } = require("express");
const reservationCartRecommendationController = require("../controllers/reservationCartRecommendationController");
const router = Router();

router.post("/", reservationCartRecommendationController.getReservationCartRecommendations);

module.exports = router;

