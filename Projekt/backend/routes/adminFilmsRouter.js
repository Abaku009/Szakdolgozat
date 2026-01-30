const { Router } = require("express");
const router = Router();
const adminFilmsController = require("../controllers/adminFilmsController");

router.patch("/:id/deactivate", adminFilmsController.deactivateFilm);
router.patch("/:id/restore", adminFilmsController.restoreFilm);
router.delete("/:id", adminFilmsController.deleteFilm);
router.patch("/:id", adminFilmsController.updateFilm);
router.post("/add_genre", adminFilmsController.addFilmGenre);
router.post("/add_language", adminFilmsController.addFilmLanguage);
router.post("/add_film", adminFilmsController.addFilm);
router.get("/:id/has_order", adminFilmsController.hasOrder);

module.exports = router;

