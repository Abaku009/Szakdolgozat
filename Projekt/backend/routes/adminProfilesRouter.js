const { Router } = require("express");
const router = Router();
const adminProfilesController = require("../controllers/adminProfilesController");

router.get("/", adminProfilesController.getAdminProfiles);

module.exports = router;

