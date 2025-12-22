const { Router } = require("express");
const onSiteReservationController = require("../controllers/reservationsController");
const router = Router();

router.post("/", onSiteReservationController.postReservations);

module.exports = router;

