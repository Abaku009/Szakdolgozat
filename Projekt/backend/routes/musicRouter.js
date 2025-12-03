const { Router } = require("express");
const musicController = require("../controllers/musicController");
const router = Router();

router.get("/", musicController.musicGet);
router.get("/genres", musicController.getMusicGenres);
router.get("/languages", musicController.getMusicLanguages);
router.get("/formats", musicController.getMusicFormats);

module.exports = router;

