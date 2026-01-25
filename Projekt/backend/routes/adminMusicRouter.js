const { Router } = require("express");
const router = Router();
const adminMusicController = require("../controllers/adminMusicController");

router.patch("/:id/deactivate", adminMusicController.deactivateMusic);
router.patch("/:id/restore", adminMusicController.restoreMusic);
router.delete("/:id", adminMusicController.deleteMusic);
router.patch("/:id", adminMusicController.updateMusic);

module.exports = router;

