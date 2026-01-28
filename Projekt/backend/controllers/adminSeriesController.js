const db = require("../database/queries/adminSeriesQuery");


async function deactivateSerie(req, res) {

    const { id } = req.params;

    try {
        await db.softDeleteSerie(id);
        res.status(200).json({ message: "Sorozat sikeresen deaktiválva!" });
    } catch(err) {
        console.error(err);
        res.status(500).json({ message: "Hiba a sorozat deaktiválásakor!" });
    }
}


async function restoreSerie(req, res) {

    const { id } = req.params;

    try {
        await db.restoreSerie(id);
        res.status(200).json({ message: "Sorozat sikeresen visszaállítva!" });
    } catch(err) {
        console.error(err);
        res.status(500).json({ message: "Hiba a sorozat visszaállításakor!" });
    }
}


async function deleteSerie(req, res) {
    
    const { id } = req.params;

    try {
        await db.deleteSerie(id);
        res.status(200).json({ message: "Sorozat sikeresen törölve!" });
    } catch(err) {
        console.error(err);
        res.status(500).json({ message: "Hiba a sorozat törlésekor!" });
    }
}


async function updateSerie(req, res) {

    const serieId = req.params.id;
    const data = req.body;

    try {
        await db.editSerie(serieId, data);
        res.json({ message: "Sorozat sikeresen módosítva!" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Hiba a módosítás során!" });
    } 
}


async function addSerieGenre(req, res) {

    const { genre } = req.body;

    try {
        await db.insertGenre(genre);
        res.status(200).json({ message: "Műfaj sikeresen hozzáadva!" });
    } catch(err) {
        console.error(err);
        res.status(500).json({ message: "Hiba a hozzáadás során!" });
    }
}


async function addSerieLanguage(req, res) {

    const { language } = req.body;

    try {
        await db.insertLanguage(language);
        res.status(200).json({ message: "Nyelv sikeresen hozzáadva!" });
    } catch(err) {
        console.error(err);
        res.status(500).json({ message: "Hiba a hozzáadás során!" });
    }
}


async function addSerie(req, res) {

    const data = req.body;

    try {
        await db.insertSerie(data);
        res.json({ message: "Sorozat sikeresen hozzáadva!" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Hiba a hozzáadás során!" });
    } 
}


module.exports = { deleteSerie, deactivateSerie, restoreSerie, updateSerie, addSerieGenre, addSerieLanguage, addSerie };

