const pool = require("../pool/pool");

async function insertMusicOrder(userId, cart) {
    const client = await pool.connect();

    try {
        await client.query("BEGIN");

        const orderResult = await client.query(
            `INSERT INTO music_orders (user_id)
             VALUES ($1)
             RETURNING order_id`,
            [userId]
        );

        const orderId = orderResult.rows[0].order_id;

        for (const item of cart) {
            await client.query(
                `INSERT INTO music_order_items (order_id, music_id, quantity)
                 VALUES ($1, $2, $3)`,
                [orderId, item.music_id, item.qty]
            );
        }

        await client.query("COMMIT");

        return orderId;

    } catch (err) {
        await client.query("ROLLBACK");
        throw err;

    } finally {
        client.release();
    }
}

module.exports = { insertMusicOrder };

