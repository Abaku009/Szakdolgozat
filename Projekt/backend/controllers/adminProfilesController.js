const db = require("../database/queries/adminProfilesQuery");

async function getAdminProfiles(req, res) {
    try {
        const profiles = await db.getAllProfiles();
        res.json(profiles);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Hiba a profilok lekérésekor!" });
    }
}

module.exports = { getAdminProfiles };

