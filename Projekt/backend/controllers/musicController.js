const db = require("../database/queries/musicQuery");

async function musicGet(req, res) {
  try {
    const showInactive = req.query.showInactive === "true";
    const music = await db.getAllMusic(showInactive);
    res.status(200).json(music);
  } catch (error) {
    console.error("Error fetching music");
    res.status(500).send("Internal Server Error");
  }
}

async function getMusicGenres(req, res) {
  try {
    const genres = await db.getMusicGenres();
    res.status(200).json(genres);
  } catch (error) {
    res.status(500).send("Error fetching genres");
  }
}

async function getMusicLanguages(req, res) {
  try {
    const languages = await db.getMusicLanguages();
    res.status(200).json(languages);
  } catch (error) {
    res.status(500).send("Error fetching languages");
  }
}

async function getMusicFormats(req, res) {
  try {
    const formats = await db.getMusicFormats();
    res.status(200).json(formats);
  } catch (error) {
    res.status(500).send("Error fetching formats");
  }
}

module.exports = { musicGet, getMusicGenres, getMusicLanguages, getMusicFormats };

