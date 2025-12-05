const db = require("../database/queries/filmQuery");

async function filmsGet(req, res) {
    try {
        const films = await db.getAllFilms();
        res.status(200).json(films);
    } catch(err) {
        console.error("Error fetching films");
        res.status(500).send("Internal Server Error");
    }
}

async function genresGet(req, res) {
    try {
        const genres = await db.getFilmGenres();
        res.status(200).json(genres);
    } catch(err) {
        res.status(500).send("Error fetching genres");
    }
}

async function languagesGet(req, res) {
    try {
        const languages = await db.getFilmLanguages();
        res.status(200).json(languages);
    } catch(err) {
        res.status(500).send("Error fetching languages");
    }
}

async function formatsGet(req, res) {
    try {
        const formats = await db.getFilmFormats();
        res.status(200).json(formats);
    } catch(err) {
        res.status(500).send("Error fetching formats");
    }
}

module.exports = { filmsGet, genresGet, languagesGet, formatsGet };

