const { Router } = require("express");
const router = Router();


router.get("/", (req, res) => {
    if(req.isAuthenticated()) {
        res.json({ user: req.user });
    } else {
        res.json({ user: null });
    }
});

module.exports = router;

