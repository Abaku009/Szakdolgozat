const { Router } = require("express");
const router = Router();
const onlineReservationController = require("../controllers/reservationsController");

router.post("/", onlineReservationController.postReservations);

module.exports = router;

