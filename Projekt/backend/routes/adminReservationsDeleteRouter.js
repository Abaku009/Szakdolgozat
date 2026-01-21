const { Router } = require("express");
const router = Router();
const adminReservationsDeleteController = require("../controllers/adminReservationsDeleteController");

router.post("/", adminReservationsDeleteController.deleteAdminReservations);

module.exports = router;

