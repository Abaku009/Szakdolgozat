const { Router } = require("express");
const router = Router();
const adminReservationsController = require("../controllers/adminReservationsController");

router.post("/", adminReservationsController.getAdminReservations);
router.post("/delete", adminReservationsController.deleteAdminReservations)

module.exports = router;

