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

            const stockResult = await client.query(
                `UPDATE music_storage
                 SET quantity = quantity - $1
                 WHERE music_storage_id = $2
                    AND quantity >= $1`,
                [item.qty, item.music_storage_id]
            );

            if (stockResult.rowCount === 0) {
                throw new Error("Nincs elegendő készlet!");
            }
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

