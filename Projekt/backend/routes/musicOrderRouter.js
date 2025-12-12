const { Router } = require("express");
const router = Router();
const musicOrderController = require("../controllers/musicOrderController");

router.post("/", musicOrderController.postMusicOrder);

module.exports = router;

