const db = require("../database/queries/registrationQuery");
const bcrypt = require("bcrypt");

async function postNewUser(req, res) {
    const { vezeteknev, keresztnev, email, jelszo } = req.body;

    try {
        const existing = await db.checkEmail(email);

        if (existing.rows.length > 0) {
            return res.status(400).json({ message: "Ez az e-mail már regisztrálva van!" });
        }

        const hashed = await bcrypt.hash(jelszo, 10);

        await db.insertNewUser(vezeteknev, keresztnev, email, hashed);

        res.status(201).json({ message: "Sikeres regisztráció!" });
    } catch(err) {
        console.error(err);
        res.status(500).json({ message: "Szerver hiba történt." });
    }
}

module.exports = { postNewUser };

