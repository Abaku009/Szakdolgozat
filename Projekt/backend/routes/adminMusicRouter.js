const { Router } = require("express");
const router = Router();
const adminMusicController = require("../controllers/adminMusicController");

router.patch("/:id/deactivate", adminMusicController.deactivateMusic);
router.patch("/:id/restore", adminMusicController.restoreMusic);
router.delete("/:id", adminMusicController.deleteMusic);
router.patch("/:id", adminMusicController.updateMusic);
router.post("/add_genre", adminMusicController.addMusicGenre);
router.post("/add_language", adminMusicController.addMusicLanguage);
router.post("/add_music", adminMusicController.addMusic);

module.exports = router;

