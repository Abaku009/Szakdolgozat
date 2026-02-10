
const pool = require("../pool/pool");


const weights = {
    genre: 7,
    performer: 3,
    language: 2,
};


async function orderCartRecommendations(cartMusicIDs) {
    if(!cartMusicIDs || cartMusicIDs.length === 0) return [];

    const { rows: cartMusicData } = await pool.query(`
        SELECT music_id, music_category_id, music_language_id, performer
        FROM music
        WHERE music_id = ANY($1)
        `,
        [cartMusicIDs]
    );

    const genres = {};
    const languages = {};
    const performers = {};

    cartMusicData.forEach(music => {
        genres[music.music_category_id] = (genres[music.music_category_id] || 0) + 1;
        languages[music.music_language_id] = (languages[music.music_language_id] || 0) + 1;
        performers[music.performer] = (performers[music.performer] || 0) + 1;
    });

    const { rows: recommendable } = await pool.query(`
        SELECT 
            music.music_id,
            music.title,
            music.performer,
            music.price,
            music.format,
            music.music_category_id,
            music.music_language_id,
            music_category.genre AS categoryname,
            music_language.language AS languagename,
            music_storage.quantity AS stock,
            music.music_storage_id,
            music.is_active
        FROM music
        JOIN music_category ON music.music_category_id = music_category.music_category_id
        JOIN music_language ON music.music_language_id = music_language.music_language_id
        JOIN music_storage ON music.music_storage_id = music_storage.music_storage_id
        WHERE music.is_active = true
        AND music_storage.quantity > 0
        AND music.music_id != ALL($1)
        `,
        [cartMusicIDs]
    );

    const scored = recommendable.map(music => {
        let score = 0;
        if(genres[music.music_category_id]) score += weights.genre * genres[music.music_category_id];
        if(performers[music.performer]) score += weights.performer * performers[music.performer];
        if(languages[music.music_language_id]) score += weights.language * languages[music.music_language_id];
        return { ...music, score };
    });

    const recommended = scored
        .filter(music => music.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, 3);

    return recommended;

};


module.exports = { orderCartRecommendations };

