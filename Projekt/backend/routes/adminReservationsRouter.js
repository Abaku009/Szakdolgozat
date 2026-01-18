const { Router } = require("express");
const router = Router();
const adminReservationsController = require("../controllers/adminReservationsController");

router.post("/", adminReservationsController.getAdminReservations);

module.exports = router;

