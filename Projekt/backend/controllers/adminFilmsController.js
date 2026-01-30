const db = require("../database/queries/adminFilmsQuery");


async function deactivateFilm(req, res) {

    const { id } = req.params;

    try {
        await db.softDeleteFilm(id);
        res.status(200).json({ message: "Film sikeresen deaktiválva!" });
    } catch(err) {
        console.error(err);
        res.status(500).json({ message: "Hiba a film deaktiválásakor!" });
    }
}


async function restoreFilm(req, res) {

    const { id } = req.params;

    try {
        await db.restoreFilm(id);
        res.status(200).json({ message: "Film sikeresen visszaállítva!" });
    } catch(err) {
        console.error(err);
        res.status(500).json({ message: "Hiba a film visszaállításakor!" });
    }
}


async function deleteFilm(req, res) {
    
    const { id } = req.params;

    try {
        await db.deleteFilm(id);
        res.status(200).json({ message: "Film sikeresen törölve!" });
    } catch(err) {
        console.error(err);
        res.status(500).json({ message: "Hiba a film törlésekor!" });
    }
}


async function updateFilm(req, res) {

    const filmId = req.params.id;
    const data = req.body;

    try {
        await db.editFilm(filmId, data);
        res.json({ message: "Film sikeresen módosítva!" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Hiba a módosítás során!" });
    } 
}


async function addFilmGenre(req, res) {

    const { genre } = req.body;

    try {
        await db.insertGenre(genre);
        res.status(200).json({ message: "Műfaj sikeresen hozzáadva!" });
    } catch(err) {
        console.error(err);
        res.status(500).json({ message: "Hiba a hozzáadás során!" });
    }
}


async function addFilmLanguage(req, res) {

    const { language } = req.body;

    try {
        await db.insertLanguage(language);
        res.status(200).json({ message: "Nyelv sikeresen hozzáadva!" });
    } catch(err) {
        console.error(err);
        res.status(500).json({ message: "Hiba a hozzáadás során!" });
    }
}


async function addFilm(req, res) {

    const data = req.body;

    try {
        await db.insertFilm(data);
        res.json({ message: "Film sikeresen hozzáadva!" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Hiba a hozzáadás során!" });
    } 
}


async function hasOrder(req, res) {
    const { id } = req.params;

    try {
        const hasOrder = await db.filmHasOrder(id);
        res.json({ hasOrder });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Hiba az ellenőrzés során!" });
    }
}


module.exports = { deleteFilm, deactivateFilm, restoreFilm, updateFilm, addFilmGenre, addFilmLanguage, addFilm, hasOrder };

