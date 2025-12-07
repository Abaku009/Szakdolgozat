const { Router } = require("express");
const registrationController = require("../controllers/registrationController");
const router = Router();

router.post("/", registrationController.postNewUser);

module.exports = router;

