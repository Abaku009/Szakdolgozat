const { Router } = require("express");
const seriesController = require("../controllers/seriesController");
const router = Router();

router.get("/", seriesController.seriesGet);
router.get("/genres", seriesController.genresGet);
router.get("/languages", seriesController.languagesGet);
router.get("/formats", seriesController.formatsGet);

module.exports = router;

