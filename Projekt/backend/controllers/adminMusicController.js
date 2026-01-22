const db = require("../database/queries/adminMusicQuery");


async function deactivateMusic(req, res) {

    const { id } = req.params;

    try {
        await db.softDeleteMusic(id);
        res.status(200).json({ message: "Zene sikeresen deaktiválva!" });
    } catch(err) {
        console.error(err);
        res.status(500).json({ message: "Hiba a zene deaktiválásakor!" });
    }
}


async function restoreMusic(req, res) {

    const { id } = req.params;

    try {
        await db.restoreMusic(id);
        res.status(200).json({ message: "Zene sikeresen visszaállítva!" });
    } catch(err) {
        console.error(err);
        res.status(500).json({ message: "Hiba a zene visszaállításakor!" });
    }
}


async function deleteMusic(req, res) {
    
    const { id } = req.params;

    try {
        await db.deleteMusic(id);
        res.status(200).json({ message: "Zene sikeresen törölve!" });
    } catch(err) {
        console.error(err);
        res.status(500).json({ message: "Hiba a zene törlésekor!" });
    }
}

module.exports = { deleteMusic, deactivateMusic, restoreMusic };

