const pool = require("../pool/pool");


const weights = {
    genre: 7,
    performer: 3,
    language: 2
};


async function musicRecommendations(userID) {
    if (!userID) return [];

    const { rows: orderData } = await pool.query(`
        SELECT 
            music.music_id,
            music.music_category_id,
            music.music_language_id,
            music.performer,
            music_orders.time
        FROM music_orders
        JOIN music_order_items ON music_orders.order_id = music_order_items.order_id
        JOIN music ON music_order_items.music_id = music.music_id
        WHERE music_orders.user_id = $1
        `, 
        [userID]
    );

    if (orderData.length === 0) return [];

    const genres = {};
    const performers = {};
    const languages = {};

    const today = new Date();
    const lambda = 0.01; 

    orderData.forEach(item => {
        const orderDate = new Date(item.time);
        const daysDifference = (today - orderDate) / (1000 * 60 * 60 * 24);

        const timeWeight = Math.exp(-lambda * daysDifference);

        genres[item.music_category_id] = (genres[item.music_category_id] || 0) + timeWeight;
        languages[item.music_language_id] = (languages[item.music_language_id] || 0) + timeWeight;
        performers[item.performer] = (performers[item.performer] || 0) + timeWeight;
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
        AND music.music_id NOT IN (
            SELECT music_order_items.music_id
            FROM music_orders
            JOIN music_order_items ON music_orders.order_id = music_order_items.order_id
            WHERE music_orders.user_id = $1
        )
        `,
        [userID]
    );

    const scored = recommendable.map(music => {
        let score = 0;

        if (genres[music.music_category_id]) score += weights.genre * genres[music.music_category_id];
        if (performers[music.performer]) score += weights.performer * performers[music.performer];
        if (languages[music.music_language_id]) score += weights.language * languages[music.music_language_id];

        return { ...music, score };
    });

    return scored
        .filter(m => m.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, 3);
    
};


module.exports = { musicRecommendations };

