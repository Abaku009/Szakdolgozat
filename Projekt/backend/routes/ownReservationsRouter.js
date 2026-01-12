const { Router } = require("express");
const ownReservationsController = require("../controllers/ownReservationsController");
const router = Router();

router.post("/", ownReservationsController.getOwnReservations);

module.exports = router;

