const { Router } = require("express");
const filmController = require("../controllers/filmController");
const router = Router();

router.get("/", filmController.filmsGet);
router.get("/genres", filmController.genresGet);
router.get("/languages", filmController.languagesGet);
router.get("/formats", filmController.formatsGet);

module.exports = router;

