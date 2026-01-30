const { Router } = require("express");
const router = Router();
const adminSeriesController = require("../controllers/adminSeriesController");

router.patch("/:id/deactivate", adminSeriesController.deactivateSerie);
router.patch("/:id/restore", adminSeriesController.restoreSerie);
router.delete("/:id", adminSeriesController.deleteSerie);
router.patch("/:id", adminSeriesController.updateSerie);
router.post("/add_genre", adminSeriesController.addSerieGenre);
router.post("/add_language", adminSeriesController.addSerieLanguage);
router.post("/add_serie", adminSeriesController.addSerie);
router.get("/:id/has_order", adminSeriesController.hasOrder);

module.exports = router;

