const { Router } = require("express");
const router = Router();

router.get("/", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.json({ message: "Sikeres kijelentkezés!" });
  });
});

module.exports = router;

