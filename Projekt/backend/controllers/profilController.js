const db = require("../database/queries/profilQuery");
const bcrypt = require("bcrypt");

async function passwordUpdate(req, res) {

    const { ujJelszo, id } = req.body;

    try {
        const hashed = await bcrypt.hash(ujJelszo, 10);
        await db.updateNewPassword(hashed, id);
        res.status(201).json({ message: "Jelszó módosítás sikeres!" });
    } catch(err) {
        console.error(err);
        res.status(500).json({ message: "Szerverhiba történt!" });
    }
    
}

module.exports = { passwordUpdate };

