const db = require("../database/queries/seriesQuery");

async function seriesGet(req, res) {
    try {
        const showInactive = req.query.showInactive === "true";
        const series = await db.getAllSeries(showInactive);
        res.status(200).json(series);
    }catch(err) {
        console.error("Error fetching series");
        res.status(500).send("Internal Server Error");
    }
}

async function genresGet(req, res) {
    try {
        const genres = await db.getSeriesGenres();
        res.status(200).json(genres);
    } catch(err) {
        res.status(500).send("Error fetching genres!");
    }
}

async function languagesGet(req, res) {
    try {
        const languages = await db.getSeriesLanguages();
        res.status(200).json(languages);
    } catch(err) {
        res.status(500).send("Error fetching languages!");
    }
}

async function formatsGet(req, res) {
    try {
        const formats = await db.getSeriesFormats();
        res.status(200).json(formats);
    } catch(err) {
        res.status(500).send("Error fetching formats!");
    }
}

module.exports = { seriesGet, genresGet, languagesGet, formatsGet };

