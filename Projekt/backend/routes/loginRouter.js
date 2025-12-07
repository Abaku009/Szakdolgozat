const { Router } = require("express");
const passport = require("passport");
const router = Router();

router.post("/", (req, res) => {
    passport.authenticate("local", (err, user, info) => {
        if(err) {
            console.error(err);
            return res.status(500).json({ message: "Szerver hiba!" });
        }

        if(!user) {
            return res.status(401).json({ message: info.message });
        }

        req.logIn(user, (err) => {
            if(err) {
                console.error(err);
                return res.status(500).json({ message: "Session hiba! "});
            }

            return res.json({ message: "Sikeres bejelentkezés!", user: req.user});
        });
    })(req, res);
});

module.exports = router;

