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


async function updateMusic(req, res) {

    const musicId = req.params.id;
    const data = req.body;

    try {
        await db.editMusic(musicId, data);
        res.json({ message: "Zene sikeresen módosítva!" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Hiba a módosítás során!" });
    } 
}


async function addMusicGenre(req, res) {

    const { genre } = req.body;

    try {
        await db.insertGenre(genre);
        res.status(200).json({ message: "Műfaj sikeresen hozzáadva!" });
    } catch(err) {
        console.error(err);
        res.status(500).json({ message: "Hiba a hozzáadás során!" });
    }
}


async function addMusicLanguage(req, res) {

    const { language } = req.body;

    try {
        await db.insertLanguage(language);
        res.status(200).json({ message: "Nyelv sikeresen hozzáadva!" });
    } catch(err) {
        console.error(err);
        res.status(500).json({ message: "Hiba a hozzáadás során!" });
    }
}


async function addMusic(req, res) {

    const data = req.body;

    try {
        await db.insertMusic(data);
        res.json({ message: "Zene sikeresen hozzáadva!" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Hiba a hozzáadás során!" });
    } 
}


module.exports = { deleteMusic, deactivateMusic, restoreMusic, updateMusic, addMusicGenre, addMusicLanguage, addMusic };

