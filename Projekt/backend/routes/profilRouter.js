const { Router } = require("express");
const profilController = require("../controllers/profilController");
const router = Router();

router.post("/", profilController.passwordUpdate);

module.exports = router;

