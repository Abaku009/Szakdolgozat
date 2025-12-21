const { Router } = require("express");
const onSiteReservationController = require("../controllers/onSiteReservationController");
const router = Router();

router.post("/", onSiteReservationController.postOnSiteReservation);

module.exports = router;

